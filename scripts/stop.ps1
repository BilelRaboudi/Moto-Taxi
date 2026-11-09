Write-Host "========================================================" -ForegroundColor Yellow
Write-Host "       Arret des serveurs MotoTaxi (Spring + Angular)   " -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Yellow

$ports = 4200, 8080
$found = 0

foreach ($p in $ports) {
    $conns = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue
    if ($conns) {
        foreach ($c in $conns) {
            try {
                Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue
                Write-Host " [OK] Port $p libere (PID $($c.OwningProcess))" -ForegroundColor Green
                $found++
            } catch {}
        }
    }
}

if ($found -eq 0) {
    Write-Host " [INFO] Les ports (4200, 8080) sont deja liberes." -ForegroundColor Gray
}

Write-Host "========================================================" -ForegroundColor Yellow
Write-Host " Tous les serveurs MotoTaxi sont desormais fermes." -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Yellow
Start-Sleep -Seconds 2
