import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: APIGatewayProxyEvent):
  Promise<APIGatewayProxyResult> => {

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
  };

  try {
    const body = JSON.parse(event.body || "{}");

    if (!body.name || !body.email || !body.amount || !body.type) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Missing required fields: name, email, amount, type",
        }),
      }
    }

    const solicitud = {
      id: uuidv4(),
      name: body.name,
      email: body.email,
      amount: body.amount,
      type: body.type,
      comments: body.comments || "",
      createdAt: new Date().toISOString(),
    }

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: solicitud,
    }))

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: 'Solicitud creada',
        solicitud,
      })
    }
  } catch (error) {
    console.error("Error creating solicitud:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Internal server error",
      }),
    }
  }
}