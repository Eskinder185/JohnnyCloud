@echo off
echo Setting up image environment variables...

REM Check if .env file exists
if exist .env (
    echo .env file already exists. Backing up to .env.backup...
    copy .env .env.backup
)

REM Create .env file with image configuration
echo Creating .env file with image paths...

REM Copy the existing env.example content and add image variables
copy env.example .env

REM Add image configuration to .env file
echo. >> .env
echo # Image Configuration >> .env
echo # Why AWS Page Images >> .env
echo VITE_WHY_AWS_IMAGE=/images/why-aws/why-aws-hero-cloud-infrastructure.jpg >> .env
echo VITE_JC_IMAGE=/images/why-aws/johnnycloud-company-logo.jpg >> .env
echo. >> .env
echo # About Page Images >> .env
echo VITE_ABOUT_HERO_IMAGE=/images/about/about-hero-team-office.jpg >> .env

echo.
echo ✅ .env file created with image configuration!
echo.
echo Your images are configured as:
echo - Why AWS Hero: /images/why-aws/why-aws-hero-cloud-infrastructure.jpg
echo - About Hero: /images/about/about-hero-team-office.jpg
echo.
echo ⚠️  Note: You still need to add a company logo at:
echo    /images/why-aws/johnnycloud-company-logo.jpg
echo.
echo 🔄 Please restart your development server:
echo    npm run dev
echo.
pause

