import { Application } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'WELCOME TO THE AIRMAILGO REST API DOC',
            version: '1.0.0',
            description: 'AirMailGo REST API Endpoints Documentation',
        },
        servers: [
            {
                url: 'http://localhost:8080',
            },
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        firstName: {
                            type: 'string',
                        },
                        lastName: {
                            type: 'string',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                        },
                        password: {
                            type: 'string',
                            minLength: 6,
                        },
                        isAdmin: {
                            type: 'boolean',
                        },
                    },
                    required: ['firstName', 'lastName', 'email', 'password'],
                },
            },
        },
    },
    apis: ['./src/controllers/**/*.ts'],
}

const swaggerDocs = swaggerJSDoc(swaggerOptions);
export const setupSwagger = (app: Application) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}