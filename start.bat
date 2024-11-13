@echo off
start cmd /k "cd /d Lavcom-Manager && npm run start"
start cmd /k "cd /d food-manager && npm run dev"
start cmd /k "cd /d laundry-manager && npm run dev"
echo Procesos de desarrollo iniciados en ventanas separadas.
pause
