@echo off
echo Building and Deploying Mouse Adventure to Google Cloud Run...

REM 0. Set Project Context
echo Setting active project to mouse-runner-481722...
call gcloud config set project mouse-runner-481722
if %errorlevel% neq 0 (
    echo Failed to set project.
    exit /b 1
)

REM 1. Build and Push Image
echo.
echo Step 1: Building container image...
call gcloud builds submit --project=mouse-runner-481722 --tag us.gcr.io/mouse-runner-481722/mouse-adventure:latest .
if %errorlevel% neq 0 (
    echo Build failed.
    exit /b 1
)

REM 2. Deploy with Terraform
echo.
echo Step 2: Deploying infrastructure...
pushd terraform\cloud
terraform init
terraform apply -var="image_url=us.gcr.io/mouse-runner-481722/mouse-adventure:latest" -auto-approve
popd

echo.
echo Cloud deployment complete.
pause
