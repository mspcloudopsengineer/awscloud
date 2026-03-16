@echo off
title Kiro Auto-Continue
powershell -ExecutionPolicy Bypass -File "%~dp0keep_kiro_alive.ps1" -IntervalMinutes 30
pause
