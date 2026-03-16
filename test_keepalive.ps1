# test_keepalive.ps1
$code = 'using System; using System.Runtime.InteropServices; public class KA2 { [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd); [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow); [DllImport("user32.dll")] public static extern void mouse_event(uint dwFlags, int dx, int dy, uint dwData, int dwExtraInfo); [DllImport("user32.dll")] public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, int dwExtraInfo); [DllImport("kernel32.dll")] public static extern uint SetThreadExecutionState(uint esFlags); }'

Add-Type -TypeDefinition $code -Language CSharp

# Step 1: prevent sleep
[KA2]::SetThreadExecutionState([uint32]::Parse("2147483651")) | Out-Null
Write-Host "[1] Prevent sleep - OK" -ForegroundColor Green

# Step 2: find Kiro
$kiro = Get-Process -Name "Kiro" -ErrorAction SilentlyContinue |
    Where-Object { $_.MainWindowHandle -ne 0 } |
    Select-Object -First 1

if ($kiro) {
    Write-Host "[2] Found Kiro - PID:$($kiro.Id) Handle:$($kiro.MainWindowHandle)" -ForegroundColor Green

    # Step 3: activate window
    [KA2]::ShowWindow($kiro.MainWindowHandle, 9) | Out-Null
    Start-Sleep -Milliseconds 200
    [KA2]::SetForegroundWindow($kiro.MainWindowHandle) | Out-Null
    Write-Host "[3] Window activated" -ForegroundColor Green

    # Step 4: mouse nudge
    [KA2]::mouse_event([uint32]1, 1, 0, [uint32]0, 0)
    Start-Sleep -Milliseconds 50
    [KA2]::mouse_event([uint32]1, -1, 0, [uint32]0, 0)
    Write-Host "[4] Mouse nudge - OK" -ForegroundColor Green

    # Step 5: F15 key (does nothing visible)
    [KA2]::keybd_event(0x7E, 0, [uint32]0, 0)
    [KA2]::keybd_event(0x7E, 0, [uint32]2, 0)
    Write-Host "[5] F15 key sent - OK" -ForegroundColor Green

    Write-Host ""
    Write-Host "=== ALL PASSED ===" -ForegroundColor Cyan
} else {
    Write-Host "[2] FAIL - Kiro window not found" -ForegroundColor Red
}
