@echo off
echo Fixing image paths in .env file...
echo.

REM Check if .env exists
if not exist .env (
    echo .env file not found. Creating from env.example...
    copy env.example .env
    echo .env file created from env.example
) else (
    echo .env file found. Updating image paths...
)

REM Update the image paths in .env
powershell -Command "(Get-Content .env) -replace 'VITE_WHY_AWS_IMAGE=.*', 'VITE_WHY_AWS_IMAGE=/images/whyawss.jpg' | Set-Content .env"
powershell -Command "(Get-Content .env) -replace 'VITE_ABOUT_HERO_IMAGE=.*', 'VITE_ABOUT_HERO_IMAGE=/images/finsecop.jpg' | Set-Content .env"

echo.
echo Image paths updated in .env:
echo VITE_WHY_AWS_IMAGE=/images/whyawss.jpg
echo VITE_ABOUT_HERO_IMAGE=/images/finsecop.jpg
echo.
echo Please restart your development server (npm run dev) for changes to take effect.
pause



