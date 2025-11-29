import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

interface BackendStackProps extends cdk.StackProps {
  table: dynamodb.Table;
  userPool: cognito.UserPool;
}

export class BackendStack extends cdk.Stack {
  public readonly apiUrl: string;

  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    const createSolicitudLambda = new lambda.Function(this,
      'CreateSolicitudHandler',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'createSolicitud.handler',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../../backend/dist')),
        environment: {
          TABLE_NAME: props.table.tableName,
        },
        timeout: cdk.Duration.seconds(10),
        memorySize: 256,
      }
    )

    const getSolicitudesLambda = new lambda.Function(this,
      'GetSolicitudesHandler',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'getSolicitudes.handler',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../../backend/dist')),
        environment: {
          TABLE_NAME: props.table.tableName,
        },
        timeout: cdk.Duration.seconds(10),
        memorySize: 256,
      }
    )

    props.table.grantWriteData(createSolicitudLambda);
    props.table.grantReadData(getSolicitudesLambda);

    const api = new apigateway.RestApi(this, 'SolicitudesApi', {
      restApiName: 'Solicitudes Service',
      description: 'API para gestion de solicitudes.',
      deployOptions: {
        stageName: 'prod',
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const cognitoAuthorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'CognitoAuthorizer', {
      cognitoUserPools: [props.userPool],
      identitySource: 'method.request.header.Authorization',
      authorizerName: 'CognitoAuthorizer',
    })

    const solicitudes = api.root.addResource('solicitudes');

    // POST /solicitudes (publico)
    solicitudes.addMethod('POST', new apigateway.LambdaIntegration(createSolicitudLambda))

    // GET /solicitudes (protegido con cognito)
    solicitudes.addMethod('GET', new apigateway.LambdaIntegration(getSolicitudesLambda), {
      authorizer: cognitoAuthorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    })

    this.apiUrl = api.url;

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      exportName: 'SolicitudesApiUrl',
      description: 'URL de la API'
    })

    new cdk.CfnOutput(this, 'ApiId', {
      value: api.restApiId,
      exportName: 'SolicitudesApiId',
    })

  }
}