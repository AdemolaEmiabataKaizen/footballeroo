#!/bin/bash
set -euo pipefail

REGION="${AWS_REGION:-us-east-1}"
STACK_NAME="${STACK_NAME:-footballeroo}"

usage() {
  echo "Usage: $0 <command>"
  echo "Commands:"
  echo "  deploy-infra   Deploy/update CloudFormation stack"
  echo "  ssh            Connect to EC2 instance via SSM"
  exit 1
}

deploy_infra() {
  echo "==> Deploying CloudFormation stack..."
  aws cloudformation deploy \
    --template-file infrastructure/cloudformation.yaml \
    --stack-name "$STACK_NAME" \
    --capabilities CAPABILITY_IAM \
    --region "$REGION" \
    --parameter-overrides \
      DBPassword="${DB_PASSWORD:?Set DB_PASSWORD}" \
      JwtSecret="${JWT_SECRET:?Set JWT_SECRET}" \
      NextAuthSecret="${NEXTAUTH_SECRET:?Set NEXTAUTH_SECRET}" \
      OpenAIApiKey="${OPENAI_API_KEY:-}" \
      FootballApiKey="${FOOTBALL_API_KEY:-}" \
      GoogleClientId="${GOOGLE_CLIENT_ID:-}" \
      GoogleClientSecret="${GOOGLE_CLIENT_SECRET:-}"
  echo "==> Stack deployed."
}

ssh_instance() {
  INSTANCE_ID=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$REGION" \
    --query "Stacks[0].Outputs[?OutputKey=='EC2InstanceId'].OutputValue" --output text)
  echo "==> Connecting to $INSTANCE_ID via SSM..."
  aws ssm start-session --target "$INSTANCE_ID" --region "$REGION"
}

case "${1:-}" in
  deploy-infra) deploy_infra ;;
  ssh) ssh_instance ;;
  *) usage ;;
esac
