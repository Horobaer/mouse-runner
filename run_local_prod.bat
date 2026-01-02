@echo off
echo Building Mouse Runner for production...
call npm run build

if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b
)

echo.
echo Production build successful!
echo Starting local production server...
echo.
echo Access the game locally at the URL below (usually http://localhost:4173)
call npm run preview
pause
