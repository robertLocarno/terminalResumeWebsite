#!/usr/bin/env bash

# Deploys the code to aws s3. Authentication and account setup should be done outside this script.

AWS_S3_BUCKET_NAME="robert-locarno-website"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"


if ! aws sts get-caller-identity &>/dev/null; then
	echo "AWS CLI is not authenticated, please sign in before running this script."
	exit 1;
fi

if ! aws s3 ls $AWS_S3_BUCKET_NAME &>/dev/null; then
	echo "S3 bucket $AWS_S3_BUCKET_NAME does not seem to exist."
	exit 1;
fi

# Build to dist
echo "===== BUILDING ====="
pnpm run build
echo "===== BUILD COMPLETE ====="

# Zip files
echo "===== ZIPPING ====="
(cd "$SCRIPT_DIR/../dist" && zip -r "$SCRIPT_DIR/../tmp/dist.zip" .)
echo "===== ZIP COMPLETE"

# Sync
echo "===== MOVING TO S3 ====="
aws s3 mv $SCRIPT_DIR/../tmp/dist.zip s3://$AWS_S3_BUCKET_NAME/dist.zip
echo "===== MOVE COMPLETE ====="
