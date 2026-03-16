# keep_kiro_alive.ps1
# Every 30 min paste "continue" message to Kiro via clipboard (bypass IME)
param([int]$IntervalMinutes = 30)

$code = 'using System; using System.Runtime.InteropServices; public class KA8 { [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd); [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow); [DllImport("kernel32.dll")] public static extern uint SetThreadExecutionState(uint esFlags); }'
Add-Type -TypeDefinition $code -Language CSharp

$msg = "Keep going with your development, debugging and fixing. If there is nothing left to do, just say done."

Write-Host "=== Kiro Auto-Continue ===" -ForegroundColor Green
Write-Host "Every ${IntervalMinutes} min | Ctrl+C to stop"
Write-Host ""

while ($true) {
    $now = (Get-Date).ToString("HH:mm:ss")
    [KA8]::SetThreadExecutionState([uint32]::Parse("2147483651")) | Out-Null

    $kiro = Get-Process -Name "Kiro" -ErrorAction SilentlyContinue |
        Where-Object { $_.MainWindowHandle -ne 0 } |
        Select-Object -First 1

    if ($kiro) {
        # save current clipboard
        $oldClip = Get-Clipboard -ErrorAction SilentlyContinue

        # put message into clipboard
        Set-Clipboard -Value $msg

        # activate Kiro
        [KA8]::ShowWindow($kiro.MainWindowHandle, 9) | Out-Null
        Start-Sleep -Milliseconds 300
        [KA8]::SetForegroundWindow($kiro.MainWindowHandle) | Out-Null
        Start-Sleep -Milliseconds 500

        # Ctrl+V paste (bypasses IME completely)
        $wshell = New-Object -ComObject WScript.Shell
        $wshell.SendKeys("^v")
        Start-Sleep -Milliseconds 300
        $wshell.SendKeys("{ENTER}")

        # restore clipboard
        if ($oldClip) { Set-Clipboard -Value $oldClip }

        Write-Host "[$now] Sent" -ForegroundColor Green
    } else {
        Write-Host "[$now] Kiro not found" -ForegroundColor Yellow
    }

    Start-Sleep -Seconds ($IntervalMinutes * 60)
}
