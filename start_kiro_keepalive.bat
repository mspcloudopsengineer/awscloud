@echo off
title Kiro Smart Monitor
powershell -ExecutionPolicy Bypass -File "%~dp0keep_kiro_alive.ps1" -IdleMinutes 5 -CheckSeconds 30 -CooldownMinutes 5 -RestartMemoryMB 4096 -RestartHours 8
pause
