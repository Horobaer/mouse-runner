echo Deploying Mouse Runner Locally via Terraform...

echo Cleaning up existing container...
call docker rm -f mouse-runner-local 2>nul

echo Changing directory to terraform\local...
pushd terraform\local

echo Initializing Terraform...
call terraform init
if %errorlevel% neq 0 (
    echo Terraform init failed!
    pause
    exit /b %errorlevel%
)

echo Applying Terraform configuration...
call terraform apply -auto-approve
if %errorlevel% neq 0 (
    echo Terraform apply failed!
    popd
    pause
    exit /b %errorlevel%
)

popd
if %errorlevel% neq 0 (
    echo Terraform apply failed!
    pause
    exit /b %errorlevel%
)

echo.
echo Deployment complete!
echo App is running at http://localhost:8091
pause
