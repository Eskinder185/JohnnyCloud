@echo off
echo Deploying updated Lambda function (v2)...

REM Create deployment package
echo Creating deployment package...
powershell -Command "Compress-Archive -Path 'lambda\app.py' -DestinationPath 'lambda-deployment-v2.zip' -Force"

echo.
echo Deployment package created: lambda-deployment-v2.zip
echo.
echo To deploy to AWS Lambda:
echo 1. Go to AWS Lambda Console
echo 2. Find your function: johnnycloud-metrics
echo 3. Click "Upload from" -> ".zip file"
echo 4. Upload lambda-deployment-v2.zip
echo 5. Click "Save"
echo.
echo The updated function now includes:
echo - POST / endpoint for comprehensive metrics (main frontend endpoint)
echo - /summary endpoint for dashboard metrics
echo - /efficiency endpoint for efficiency metrics  
echo - /reliability endpoint for reliability metrics
echo - Proper CORS headers for all responses
echo - OPTIONS request handling for CORS preflight
echo - Data structure matching frontend expectations
echo.
echo This fixes both CORS errors AND the "r.map is not a function" error!
echo.
echo After deployment, test with: python test-endpoints.py
echo.
pause
