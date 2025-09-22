@echo off
echo Updating image paths in .env file...

REM Create backup
copy .env .env.backup

REM Update the image paths
powershell -Command "(Get-Content .env) -replace 'VITE_WHY_AWS_IMAGE=/images/why-aws/why-aws-hero-cloud-infrastructure.jpg', 'VITE_WHY_AWS_IMAGE=/images/why-aws-hero-cloud-infrastructure.jpg' | Set-Content .env"
powershell -Command "(Get-Content .env) -replace 'VITE_ABOUT_HERO_IMAGE=/images/about/about-hero-team-office.jpg', 'VITE_ABOUT_HERO_IMAGE=/images/about-hero-team-office.jpg' | Set-Content .env"
powershell -Command "(Get-Content .env) -replace 'VITE_JC_IMAGE=/images/why-aws/johnnycloud-company-logo.jpg', 'VITE_JC_IMAGE=/images/johnny5_login.png' | Set-Content .env"

echo Image paths updated successfully!
echo.
echo Updated paths:
echo - VITE_WHY_AWS_IMAGE=/images/why-aws-hero-cloud-infrastructure.jpg
echo - VITE_ABOUT_HERO_IMAGE=/images/about-hero-team-office.jpg  
echo - VITE_JC_IMAGE=/images/johnny5_login.png
echo.
echo Backup saved as .env.backup
pause

