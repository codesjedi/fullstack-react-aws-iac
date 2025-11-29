#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { DatabaseStack } from '../lib/stacks/database-stack';
import { AuthStack } from '../lib/stacks/auth-stack';
import { BackendStack } from '../lib/stacks/backend-stack';
import { FrontendStack } from '../lib/stacks/frontend-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
}

const databaseStack = new DatabaseStack(app, 'SolicitudesDbStack', { env })

const authStack = new AuthStack(app, 'SolicitudesAuthStack', { env })

const backendStack = new BackendStack(app, 'SolicitudesBackendStack', {
  env,
  table: databaseStack.table,
  userPool: authStack.userPool,
});

const frontendStack = new FrontendStack(app, 'SolicitudesFrontendStack', {
  env,
  apiUrl: backendStack.apiUrl,
  userPoolId: authStack.userPool.userPoolId,
  userPoolClientId: authStack.userPoolClient.userPoolClientId,
});
