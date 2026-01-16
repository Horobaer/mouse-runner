---
trigger: always_on
---

# Prevent the agent from indexing binary provider data
**/.terraform/providers/**
**/.terraform/modules/**

# Prevent agent from reading state (security best practice)
*.tfstate*