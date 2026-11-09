Write-Host "========================================================" -ForegroundColor Yellow
Write-Host "      Lancement MotoTaxi TN (Spring Boot Pur + Angular) " -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Yellow

$rootDir = Split-Path -Parent $PSScriptRoot

# 1. Verification MySQL (port 3306)
$mysqlConn = Get-NetTCPConnection -LocalPort 3306 -State Listen -ErrorAction SilentlyContinue
if (-not $mysqlConn) {
    Write-Host "[1/3] Demarrage de MySQL (XAMPP)..." -ForegroundColor Cyan
    if (Test-Path "C:\xampp\mysql\bin\mysqld.exe") {
        Start-Process -FilePath "C:\xampp\mysql\bin\mysqld.exe" -ArgumentList "--defaults-file=C:\xampp\mysql\bin\my.ini" -WorkingDirectory "C:\xampp" -WindowStyle Hidden
        Start-Sleep -Seconds 3
    }
} else {
    Write-Host "[1/3] Base de donnees MySQL active sur le port 3306." -ForegroundColor Green
}

# 2. Configuration ADB reverse pour smartphone physique (USB)
$adbPath = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
if (Test-Path $adbPath) {
    Write-Host "[2/3] Configuration du pont USB Android (adb reverse 4200 & 8080)..." -ForegroundColor Cyan
    & $adbPath reverse tcp:4200 tcp:4200 2>$null
    & $adbPath reverse tcp:8080 tcp:8080 2>$null
}

# 3. Lancement Spring Boot Pur (REST API + WebSocket Realtime sur port 8080)
Write-Host "[3/3] Demarrage du Backend Spring Boot Pur (port 8080)..." -ForegroundColor Cyan
$springRunBat = Join-Path $rootDir "backend-spring\run.bat"
Start-Process -FilePath "cmd.exe" -ArgumentList "/k `"$springRunBat`""

Start-Sleep -Seconds 3

# 4. Lancement Angular Frontend (Port 4200)
Write-Host "Demarrage du Frontend Angular (port 4200)..." -ForegroundColor Cyan
$frontendRunBat = Join-Path $rootDir "frontend\run.bat"
Start-Process -FilePath "cmd.exe" -ArgumentList "/k `"$frontendRunBat`""

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  Architecture 100% Spring Boot Pure prete !" -ForegroundColor Green
Write-Host "  - Frontend Web & Mobile: http://localhost:4200" -ForegroundColor White
Write-Host "  - API REST Spring Boot:  http://localhost:8080/api" -ForegroundColor White
Write-Host "  - WebSocket Realtime:    ws://localhost:8080/ws/realtime" -ForegroundColor White
Write-Host "  - Mobile Android:        Connecte via USB (adb reverse)" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Green
Write-Host "Pour tout arreter, double-cliquez sur stop_all.bat." -ForegroundColor Yellow
Start-Sleep -Seconds 2
