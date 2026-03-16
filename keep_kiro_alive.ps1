# keep_kiro_alive.ps1
# Smart Kiro monitor + auto-restart + rotating escalation messages
param(
    [string]$WorkspacePath = "",
    [int]$IdleMinutes = 5,
    [int]$CheckSeconds = 30,
    [int]$CooldownMinutes = 5,
    [int]$RestartMemoryMB = 4096,
    [int]$RestartHours = 8
)

# --- Win32 API ---
$code = 'using System; using System.Runtime.InteropServices; public class KX { [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd); [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow); [DllImport("kernel32.dll")] public static extern uint SetThreadExecutionState(uint esFlags); }'
Add-Type -TypeDefinition $code -Language CSharp

# --- message pools ---
$normalMessages = @(
    "Continue your development work. Pick up where you left off.",
    "Keep going. Check if there are any remaining tasks or bugs to fix.",
    "Resume working. Review what you last changed and continue from there.",
    "Don't stop. If the previous task is done, move on to the next one.",
    "Continue coding. Look at the recent changes and keep improving.",
    "Pick up where you left off. Fix any issues you find.",
    "Keep building. Check for errors, optimize, and move forward."
)
$escalateMessages = @(
    "You seem to have stopped. Please review the last files you modified and continue working on them. If stuck, try a different approach.",
    "Still waiting for you to continue. Look at the code you last touched, find any bugs or improvements, and keep going.",
    "Please resume immediately. Check git diff for uncommitted changes, fix any issues, and continue development.",
    "You have been idle for a while. Re-read the last error or task, think step by step, and continue working."
)
$strongMessages = @(
    "IMPORTANT: You must continue working. Here is what to do: 1) Check the last files you modified 2) Look for any errors or incomplete code 3) Fix them 4) Move to the next task. Do NOT stop until you say done.",
    "ACTION REQUIRED: Review all recent changes, run tests if possible, fix any broken code, and continue development. Explain what you are doing as you go.",
    "URGENT: You have been idle too long. Start by listing what tasks remain, then pick the most important one and implement it now."
)

# --- get recent files ---
function Get-RecentFiles {
    param([string]$Path, [int]$Minutes = 60)
    $since = (Get-Date).AddMinutes(-$Minutes)
    Get-ChildItem -Path $Path -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object {
            $skip = $false
            foreach ($d in @("node_modules", ".git", "__pycache__", "uv.lock", ".pyc")) {
                if ($_.FullName -like "*\$d\*" -or $_.FullName -like "*\$d") { $skip = $true; break }
            }
            (-not $skip) -and ($_.Extension -match "\.(py|ts|tsx|js|yaml|yml|json|sh|md)$") -and ($_.LastWriteTime -gt $since)
        } |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 5
}

# --- build message ---
function Build-Message {
    param([int]$Level, $RecentFiles, [string]$WsPath)
    if ($Level -le 1) { $pool = $normalMessages }
    elseif ($Level -le 3) { $pool = $escalateMessages }
    else { $pool = $strongMessages }

    $msg = $pool[(Get-Random -Maximum $pool.Count)]
    if ($RecentFiles -and $RecentFiles.Count -gt 0) {
        $names = ($RecentFiles | ForEach-Object {
            $_.FullName.Replace($WsPath, "").TrimStart("\").Replace("\", "/")
        }) -join ", "
        $msg += " Recent files: $names"
    }
    return $msg
}

# --- send to Kiro ---
function Send-ToKiro {
    param([string]$Message)
    $kiro = Get-Process -Name "Kiro" -ErrorAction SilentlyContinue |
        Where-Object { $_.MainWindowHandle -ne 0 } |
        Select-Object -First 1
    if (-not $kiro) { return $false }

    $oldClip = Get-Clipboard -ErrorAction SilentlyContinue
    Set-Clipboard -Value $Message

    [KX]::ShowWindow($kiro.MainWindowHandle, 9) | Out-Null
    Start-Sleep -Milliseconds 300
    [KX]::SetForegroundWindow($kiro.MainWindowHandle) | Out-Null
    Start-Sleep -Milliseconds 500

    $wshell = New-Object -ComObject WScript.Shell
    $wshell.SendKeys("^v")
    Start-Sleep -Milliseconds 300
    $wshell.SendKeys("{ENTER}")

    if ($oldClip) { Set-Clipboard -Value $oldClip }
    return $true
}

# --- restart Kiro ---
function Restart-Kiro {
    param([string]$Reason)
    Write-Host ""
    Write-Host ">>> RESTARTING KIRO: $Reason" -ForegroundColor Red

    # find Kiro executable path
    $kiro = Get-Process -Name "Kiro" -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $kiro) { return $false }

    $exePath = $kiro.Path
    if (-not $exePath) {
        # fallback: common install paths
        $candidates = @(
            "$env:LOCALAPPDATA\Programs\Kiro\Kiro.exe",
            "$env:LOCALAPPDATA\Kiro\Kiro.exe",
            "C:\Program Files\Kiro\Kiro.exe"
        )
        foreach ($c in $candidates) {
            if (Test-Path $c) { $exePath = $c; break }
        }
    }

    if (-not $exePath) {
        Write-Host ">>> Cannot find Kiro.exe path" -ForegroundColor Red
        return $false
    }

    Write-Host ">>> Kiro path: $exePath" -ForegroundColor Yellow

    # gracefully close
    Get-Process -Name "Kiro" -ErrorAction SilentlyContinue | ForEach-Object { $_.CloseMainWindow() | Out-Null }
    Start-Sleep -Seconds 5

    # force kill remaining
    Get-Process -Name "Kiro" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 3

    # restart
    Start-Process -FilePath $exePath
    Write-Host ">>> Kiro restarted, waiting 30s for startup..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30

    # verify
    $newKiro = Get-Process -Name "Kiro" -ErrorAction SilentlyContinue |
        Where-Object { $_.MainWindowHandle -ne 0 } |
        Select-Object -First 1
    if ($newKiro) {
        Write-Host ">>> Kiro is back (PID:$($newKiro.Id))" -ForegroundColor Green
        return $true
    } else {
        Write-Host ">>> Kiro window not ready yet, will retry next cycle" -ForegroundColor Yellow
        return $false
    }
}

# --- check if restart needed ---
function Check-NeedRestart {
    $procs = Get-Process -Name "Kiro" -ErrorAction SilentlyContinue
    if (-not $procs) { return $null }

    # memory check: sum all Kiro processes
    $totalMB = [math]::Round(($procs | Measure-Object WorkingSet64 -Sum).Sum / 1MB, 0)
    if ($totalMB -ge $RestartMemoryMB) {
        return "Memory ${totalMB}MB >= ${RestartMemoryMB}MB"
    }

    # uptime check: oldest process
    $oldest = $procs | Sort-Object StartTime | Select-Object -First 1
    if ($oldest.StartTime) {
        $uptimeHrs = [math]::Round(((Get-Date) - $oldest.StartTime).TotalHours, 1)
        if ($uptimeHrs -ge $RestartHours) {
            return "Uptime ${uptimeHrs}h >= ${RestartHours}h"
        }
    }

    return $null
}

# ========== MAIN ==========

if (-not $WorkspacePath -or -not (Test-Path $WorkspacePath)) {
    $WorkspacePath = "C:\Users\$env:USERNAME\Desktop\cloudops\cmp\awscloud"
}

Write-Host "=== Kiro Smart Monitor ===" -ForegroundColor Green
Write-Host "Workspace     : $WorkspacePath"
Write-Host "Idle trigger  : ${IdleMinutes} min"
Write-Host "Check every   : ${CheckSeconds}s"
Write-Host "Cooldown      : ${CooldownMinutes} min"
Write-Host "Restart memory: ${RestartMemoryMB} MB"
Write-Host "Restart uptime: ${RestartHours} h"
Write-Host ""
Write-Host "Ctrl+C to stop"
Write-Host ""

$lastFileChange = Get-Date
$lastSendTime = (Get-Date).AddMinutes(-$CooldownMinutes - 1)
$lastRestartCheck = Get-Date
$escalationLevel = 0
$lastSnapshot = @{}

# initial snapshot
Get-ChildItem -Path $WorkspacePath -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object {
        $skip = $false
        foreach ($d in @("node_modules", ".git", "__pycache__", "uv.lock")) {
            if ($_.FullName -like "*\$d\*") { $skip = $true; break }
        }
        (-not $skip) -and ($_.Extension -match "\.(py|ts|tsx|js|yaml|yml|json|sh|md)$")
    } |
    ForEach-Object { $lastSnapshot[$_.FullName] = $_.LastWriteTime }

while ($true) {
    $now = Get-Date
    $nowStr = $now.ToString("HH:mm:ss")
    [KX]::SetThreadExecutionState([uint32]::Parse("2147483651")) | Out-Null

    # --- restart check (every 5 min) ---
    if (($now - $lastRestartCheck).TotalMinutes -ge 5) {
        $lastRestartCheck = $now
        $restartReason = Check-NeedRestart
        if ($restartReason) {
            $restarted = Restart-Kiro -Reason $restartReason
            if ($restarted) {
                $lastFileChange = Get-Date
                $escalationLevel = 0
                Start-Sleep -Seconds 10
                continue
            }
        }
    }

    # --- check file changes ---
    $changed = $false
    $changedFiles = @()

    Get-ChildItem -Path $WorkspacePath -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object {
            $skip = $false
            foreach ($d in @("node_modules", ".git", "__pycache__", "uv.lock")) {
                if ($_.FullName -like "*\$d\*") { $skip = $true; break }
            }
            (-not $skip) -and ($_.Extension -match "\.(py|ts|tsx|js|yaml|yml|json|sh|md)$")
        } |
        ForEach-Object {
            $prev = $lastSnapshot[$_.FullName]
            if (-not $prev -or $_.LastWriteTime -gt $prev) {
                $changed = $true
                $changedFiles += $_
                $lastSnapshot[$_.FullName] = $_.LastWriteTime
            }
        }

    if ($changed) {
        $lastFileChange = $now
        $escalationLevel = 0
        $names = ($changedFiles | Select-Object -First 3 | ForEach-Object { $_.Name }) -join ", "
        Write-Host "[$nowStr] Active - $names" -ForegroundColor DarkGray
    }
    else {
        $idleMin = [math]::Round(($now - $lastFileChange).TotalMinutes, 1)
        $cooldownOk = ($now - $lastSendTime).TotalMinutes -ge $CooldownMinutes

        if ($idleMin -ge $IdleMinutes -and $cooldownOk) {
            $escalationLevel++
            $levelName = if ($escalationLevel -le 1) { "NORMAL" } elseif ($escalationLevel -le 3) { "ESCALATE" } else { "STRONG" }

            $recentFiles = Get-RecentFiles -Path $WorkspacePath -Minutes 60
            $msg = Build-Message -Level $escalationLevel -RecentFiles $recentFiles -WsPath $WorkspacePath

            Write-Host "[$nowStr] Idle ${idleMin}min | L$escalationLevel ($levelName)" -ForegroundColor Cyan
            Write-Host "  -> $msg" -ForegroundColor White

            $sent = Send-ToKiro -Message $msg
            if ($sent) {
                $lastSendTime = $now
                Write-Host "[$nowStr] Sent" -ForegroundColor Green
            } else {
                Write-Host "[$nowStr] Kiro not found" -ForegroundColor Yellow
            }
        }
        elseif ($idleMin -ge 1) {
            # show status with memory info
            $procs = Get-Process -Name "Kiro" -ErrorAction SilentlyContinue
            $memInfo = ""
            if ($procs) {
                $totalMB = [math]::Round(($procs | Measure-Object WorkingSet64 -Sum).Sum / 1MB, 0)
                $memInfo = " | Mem:${totalMB}MB"
            }
            Write-Host "[$nowStr] Idle ${idleMin}min (L$escalationLevel)$memInfo" -ForegroundColor DarkGray
        }
    }

    Start-Sleep -Seconds $CheckSeconds
}
