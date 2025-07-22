import { Application } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';

// Swagger Options
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
                MailPickup: { 
                    type: 'object',
                    properties: {
                        userId: {
                            type: 'string',
                            format: 'objectId',
                        },
                        pickupTime: {
                            type: 'string',
                            format: 'date-time',
                        },
                        address: {
                            type: 'object',
                            properties: {
                                street: {
                                    type: 'string',
                                    example: "123 Main St",
                                },
                                city: {
                                    type: 'string',
                                    example: "Springfield",
                                },
                                state: {
                                    type: 'string',
                                    example: "IL",
                                },
                                zipCode: {
                                    type: 'string',
                                    example: "62701",
                                },
                                country: {
                                    type: 'string',
                                    example: "USA",
                                },
                            },
                            required: ['street', 'city', 'state', 'zipCode', 'country'],
                        },
                        notes: {
                            type: 'string',
                            example: "Leave at front door.",
                        },
                        packageDetails: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    weight: {
                                        type: 'number',
                                        example: 2.5,
                                    },
                                    dimensions: {
                                        type: 'object',
                                        properties: {
                                            length: {
                                                type: 'number',
                                                example: 10,
                                            },
                                            width: {
                                                type: 'number',
                                                example: 5,
                                            },
                                            height: {
                                                type: 'number',
                                                example: 3,
                                            },
                                        },
                                        required: ['length', 'width', 'height'],
                                    },
                                    description: {
                                        type: 'string',
                                        example: "Small box containing documents.",
                                    },
                                },
                                required: ['weight', 'dimensions', 'description'],
                            },
                        },
                    },
                    required: ['userId', 'pickupTime', 'address', 'packageDetails'], // Specify required fields
                },
            },
        },
    },
    apis: ['./src/controllers/**/*.ts'], // Path to the API docs
}

// Initialize Swagger Docs
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Setup Swagger UI
export const setupSwagger = (app: Application) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}