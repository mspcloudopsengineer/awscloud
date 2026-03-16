@echo off
:: 注册为 Windows 开机自启任务
:: 需要以管理员身份运行

set SCRIPT_PATH=%~dp0keep_kiro_alive.ps1

schtasks /create /tn "KiroKeepAlive" /tr "powershell -ExecutionPolicy Bypass -WindowStyle Hidden -File \"%SCRIPT_PATH%\"" /sc onlogon /rl highest /f

if %errorlevel% equ 0 (
    echo.
    echo [OK] 已注册开机自启任务: KiroKeepAlive
    echo.
    echo 管理命令:
    echo   启动: schtasks /run /tn "KiroKeepAlive"
    echo   停止: schtasks /end /tn "KiroKeepAlive"
    echo   删除: schtasks /delete /tn "KiroKeepAlive" /f
) else (
    echo.
    echo [FAIL] 注册失败，请右键"以管理员身份运行"
)

pause
