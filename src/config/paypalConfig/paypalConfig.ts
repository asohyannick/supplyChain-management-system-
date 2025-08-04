import { Client, Environment } from '@paypal/paypal-server-sdk';
const paypal = new Client({
   clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID as string,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET as string,
  },
  environment: Environment.Sandbox, // or Environment.Production for live
  timeout: 0, 
  logging: {
    logLevel: 'INFO', 
    logRequest: {
      logBody: true,
    },
    logResponse: {
      logHeaders: true,
    },
  },
});

export default paypal;