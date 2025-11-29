import { Amplify } from "aws-amplify";

export const configureAmplify = (userPoolId: string, userPoolClientId: string, apiUrl: string) => {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
        loginWith: {
          email: true,
          username: true
        }
      }
    },
    API: {
      REST: {
        SolicitudesAPI: {
          endpoint: apiUrl,
          region: "us-east-1",
        }
      }
    }
  })
}