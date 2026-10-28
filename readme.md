# Deploying to Cloud Run with the Unified Build API

This guide provides the commands to package, upload, and deploy this Node.js Express application to Cloud Run using the v2 `UpdateService` Unified Build API.

## 1. Create a Zip Archive

Create a zip archive of the current directory's contents, excluding the `node_modules` directory (and any existing zip archive) if present:

```bash
zip -r hello-world-nodejs.zip . -x "node_modules/*" "hello-world-nodejs.zip"
```

## 2. Upload the Zip Archive to GCS

Upload the archive to the Cloud Storage source bucket:

```bash
gcloud storage cp hello-world-nodejs.zip gs://run-sources-mattrobertsontest-us-east1/unified-apps/hello-world-nodejs.zip
```

## 3. Deploy to Cloud Run via `v2/UpdateService`

Call the Cloud Run v2 `UpdateService` endpoint (`PATCH`) using `curl` with `allowMissing=true` (so the service is created if it does not already exist):

```bash
PROJECT_ID="mattrobertsontest"
REGION="us-east1"
SERVICE_NAME="hellounified"

curl -X PATCH \
  -H "Authorization: Bearer $(gcloud auth application-default print-access-token)" \
  -H "Content-Type: application/json" \
  "https://staging-run.sandbox.googleapis.com/v2/projects/${PROJECT_ID}/locations/${REGION}/services/${SERVICE_NAME}?allowMissing=true" \
  -d '{
    "template": {
      "containers": [
        {
          "sourceCode": {
            "cloudStorageSource": {
              "bucket": "run-sources-mattrobertsontest-us-east1",
              "object": "unified-apps/hello-world-nodejs.zip"
            }
          },
          "buildConfig": {
            "imageRepositoryUri": "us-east1-docker.pkg.dev/mattrobertsontest/somethingnew/hellounified",
            "buildpacksBuild": {}
          }
        }
      ]
    }
  }'
```

> **Note:** If redeploying after updating the zip archive at the same GCS path without specifying an object `generation`, append `&forceNewRevision=true` to the request URL so Cloud Run creates a new revision and triggers a fresh build.
