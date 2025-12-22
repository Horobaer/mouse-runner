@echo off
echo Deploying Mouse Adventure to Google Cloud Run...
echo.
echo Ensuring gcloud is installed...
where gcloud >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: gcloud CLI is not found in PATH. Please install Google Cloud SDK.
    pause
    exit /b 1
)

echo.
echo Deploying with cost optimization (256MB RAM, 1 CPU, Max 1 Instance)...
cmd /c "gcloud run deploy mouse-runner --source . --region europe-west3 --allow-unauthenticated --memory 256Mi --cpu 1 --max-instances 1 --port 80 --service-account gamer-des-nordens@mouse-runner-481722.iam.gserviceaccount.com --project mouse-runner-481722"

if %errorlevel% neq 0 (
    echo.
    echo Deployment failed. Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo Deployment Successful!
pause
