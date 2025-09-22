#!/bin/bash

echo "Deploying updated Lambda function..."

# Create deployment package
echo "Creating deployment package..."
cd lambda
zip -r ../lambda-deployment.zip app.py
cd ..

echo ""
echo "Deployment package created: lambda-deployment.zip"
echo ""
echo "To deploy to AWS Lambda:"
echo "1. Go to AWS Lambda Console"
echo "2. Find your function: johnnycloud-metrics"
echo "3. Click 'Upload from' -> '.zip file'"
echo "4. Upload lambda-deployment.zip"
echo "5. Click 'Save'"
echo ""
echo "The updated function now includes:"
echo "- /summary endpoint for dashboard metrics"
echo "- /efficiency endpoint for efficiency metrics"
echo "- /reliability endpoint for reliability metrics"
echo "- Proper CORS headers for all responses"
echo "- OPTIONS request handling for CORS preflight"
echo ""
echo "After deployment, your frontend should work without CORS errors!"
echo ""

# Make the script executable
chmod +x deploy-lambda.sh


