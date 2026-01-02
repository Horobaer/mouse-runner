echo Deploying Mouse Adventure to Google Cloud via Terraform...
echo.

echo Setting gcloud project...
call gcloud config set project mouse-runner-481722
if %errorlevel% neq 0 (
    echo Error: Failed to set gcloud project.
    pause
    exit /b 1
)

echo Changing directory to terraform/cloud...
cd terraform\cloud

echo Initializing Terraform...
call terraform init
if %errorlevel% neq 0 (
    echo Error: Terraform init failed.
    pause
    exit /b 1
)

echo.
echo Applying Terraform Configuration...
call terraform apply -auto-approve
if %errorlevel% neq 0 (
    echo Error: Terraform apply failed.
    pause
    exit /b 1
)

echo.
echo Deployment Complete!
echo You can see the service URL in the 'Outputs' above.
pause
