# Deployment Rules

## 1. Infrastructure as Code (IaC)
- **Tooling**: Use **Terraform** exclusively for all deployment tasks.
- **No Ops Scripts**: Avoid creating `.bat` or `.sh` wrapper scripts for deployment. Developers should run Terraform commands directly to ensure transparency and standard workflows.

## 2. Directory Structure & Isolation
- **Separation of Environments**: distinct configurations must be maintained to prevent state pollution and accidental cross-environment changes.
  - `terraform/local/`: dedicated to local Docker environments.
  - `terraform/cloud/`: dedicated to Google Cloud Platform (Cloud Run) environments.
- **No Root Config**: Never place `main.tf` or other Terraform files in the project root.

## 3. Workflow
- **Standard Commands**: All deployments must follow the standard lifecycle:
  1. `cd terraform/<environment>`
  2. `terraform init` (only on first run or provider change)
  3. `terraform apply`
- **Avoid Targeting**: Do not use `-target` flags to isolate resources within a mixed configuration. Rely on directory separation instead.

## 4. Implementation Details
- **Local Environment**:
  - Use the `kreuzwerker/docker` provider.
  - Build images relative to the project root (`../../`).
  - Use `local-exec` for `docker build` commands if the Docker provider build step proves unreliable or restricted.
- **Cloud Environment**:
  - Region: `us-central1` (unless cost/latency dictates otherwise).
  - Compute: **Cloud Run** (v2 service).
  - Build: Use `gcloud builds submit` via `local-exec` to offload container building to the cloud.
