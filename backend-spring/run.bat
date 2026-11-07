@echo off
title MotoTaxi Spring Boot API
echo ==============================================
echo Demarrage de MotoTaxi Spring Boot (Port 8080)
echo ==============================================
cd /d "%~dp0"
call mvnw.cmd spring-boot:run
pause
