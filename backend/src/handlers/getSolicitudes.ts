import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";


const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: APIGatewayProxyEvent): 
  Promise<APIGatewayProxyResult> => {
    try {

      const headers = {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,OPTIONS'
      }

      const result = await docClient.send(new ScanCommand({
        TableName: TABLE_NAME,
      }))

      const solicitudes = (result.Items || new Array()).sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          count: solicitudes.length,
          data: solicitudes
        }),
      }
    } catch (error) {
      console.error("Error fetching solicitudes:", error);
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Internal Server Error" }),
      };
    }
  }