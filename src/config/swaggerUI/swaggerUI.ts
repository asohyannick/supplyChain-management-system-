import { Application } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'WELCOME TO THE AIRMAILGO REST API DOC',
            version: '1.0.0',
            description:'AirMailGoRESTAPI Documentation',
        },
        servers:[
            {
                url: 'http://localhost:8080',
            },
        ],
    },
    apis: ['./src/controllers/**/*.ts'],
}

const swaggerDocs = swaggerJSDoc(swaggerOptions);
export const setupSwagger = (app:Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}