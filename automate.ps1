# CloudHub Build and Test Automation Script
# This script automates building and testing the CloudHub/OptScale project

param(
    [string]$Action = "all",  # all, build, test, lock
    [string]$Service = "",    # specific service to test, empty for all
    [switch]$NoCache
)

Write-Host "=== CloudHub Automation Script ===" -ForegroundColor Green

# Check prerequisites
function Check-Prerequisites {
    Write-Host "Checking prerequisites..." -ForegroundColor Yellow

    # Check Docker
    try {
        $dockerVersion = docker --version 2>$null
        Write-Host "✓ Docker found: $dockerVersion" -ForegroundColor Green
    } catch {
        Write-Host "✗ Docker not found. Please install Docker Desktop from https://www.docker.com/products/docker-desktop" -ForegroundColor Red
        exit 1
    }

    # Check uv
    try {
        if (Test-Path ".\uv.exe") {
            $uvVersion = .\uv.exe --version 2>$null
        } else {
            $uvVersion = uv --version 2>$null
        }
        Write-Host "✓ uv found: $uvVersion" -ForegroundColor Green
    } catch {
        Write-Host "✗ uv not found. Please download uv.exe from https://github.com/astral-sh/uv/releases and place it in the project root, or add uv to PATH." -ForegroundColor Red
        exit 1
    }

    # Check WSL or Git Bash for bash scripts
    $bashAvailable = $false
    try {
        bash --version >$null 2>&1
        $bashAvailable = $true
    } catch {
        try {
            # Try Git Bash
            $gitBash = "${env:ProgramFiles}\Git\bin\bash.exe"
            if (Test-Path $gitBash) {
                $bashAvailable = $true
            }
        } catch {}
    }

    if (-not $bashAvailable) {
        Write-Host "✗ bash not found. Please install WSL or Git for Windows to run bash scripts." -ForegroundColor Red
        exit 1
    }

    Write-Host "✓ All prerequisites met" -ForegroundColor Green
}

# Build all services
function Build-All {
    Write-Host "Building all services..." -ForegroundColor Yellow

    $buildArgs = "./build.sh"
    if ($NoCache) {
        $buildArgs += " --no-cache"
    }

    try {
        bash $buildArgs
        Write-Host "✓ Build completed successfully" -ForegroundColor Green
    } catch {
        Write-Host "✗ Build failed: $_" -ForegroundColor Red
        exit 1
    }
}

# Test services
function Test-Services {
    Write-Host "Running tests..." -ForegroundColor Yellow

    $testDirs = Get-ChildItem -Directory | Where-Object { $_.Name -match "^(auth|bi_exporter|bumischeduler|bumiworker|diproxy|diworker)$" }

    foreach ($dir in $testDirs) {
        if ($Service -and $dir.Name -ne $Service) { continue }

        $testScript = Join-Path $dir.FullName "run_test.sh"
        if (Test-Path $testScript) {
            Write-Host "Testing $($dir.Name)..." -ForegroundColor Cyan
            try {
                Push-Location $dir.FullName
                bash run_test.sh
                Write-Host "✓ $($dir.Name) tests passed" -ForegroundColor Green
            } catch {
                Write-Host "✗ $($dir.Name) tests failed: $_" -ForegroundColor Red
                Pop-Location
                exit 1
            }
            Pop-Location
        }
    }

    Write-Host "✓ All tests completed successfully" -ForegroundColor Green
}

# Lock dependencies
function Lock-Dependencies {
    Write-Host "Locking dependencies..." -ForegroundColor Yellow

    try {
        bash ./uv_lock.sh
        Write-Host "✓ Dependencies locked successfully" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed to lock dependencies: $_" -ForegroundColor Red
        exit 1
    }
}

# Main execution
Check-Prerequisites

switch ($Action) {
    "build" { Build-All }
    "test" { Test-Services }
    "lock" { Lock-Dependencies }
    "all" {
        Lock-Dependencies
        Build-All
        Test-Services
    }
    default {
        Write-Host "Usage: .\automate.ps1 -Action <all|build|test|lock> [-Service <service_name>] [-NoCache]" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "=== Automation completed ===" -ForegroundColor Green