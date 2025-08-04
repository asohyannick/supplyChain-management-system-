import { Application } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'AirMailGoBackend Restful APIs Documentation',
            version: '1.0.0',
            description: 'The AirMailGoBackend API documentation provides detailed information about the endpoints, request/response formats, and authentication methods used in the application.',
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
                        },
                        role: {
                            type: 'string',
                            enum: ['Admin', 'Dispatcher', 'Drone Operator', 'User'],
                        },
                        refreshToken: {
                            type: 'string',
                        },
                        biometricData: {
                            type: 'string',
                        },
                        qrCodeSecret: {
                            type: 'string',
                        },
                    },
                    required: ['firstName', 'lastName', 'email', 'password', 'biometricData' ,'role'],
                },
                Drone: { 
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
                                },
                                city: {
                                    type: 'string',
                                },
                                state: {
                                    type: 'string',
                                    example: "IL",
                                },
                                zipCode: {
                                    type: 'string',
                                },
                                country: {
                                    type: 'string',
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
                                    },
                                    dimensions: {
                                        type: 'object',
                                        properties: {
                                            length: {
                                                type: 'number',
                                            },
                                            width: {
                                                type: 'number',
                                            },
                                            height: {
                                                type: 'number',
                                            },
                                        },
                                        required: ['length', 'width', 'height'],
                                    },
                                    description: {
                                        type: 'string',
                                    },
                                },
                                required: ['weight', 'dimensions', 'description'],
                            },
                        },
                    },
                    required: ['userId', 'pickupTime', 'address', 'packageDetails'], 
                },
                BlockChainDelivery: {
                    type: 'object',
                    properties: {   
                        userId: {
                            type: 'string',
                            format: 'objectId', 
                        },
                        deliveryDetails: {
                            type: 'string',     
                        },  
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                        },  
                        blockchainHash: {
                            type: 'string',
                        },
                    },
                    required: ['userId', 'deliveryDetails', 'timestamp', 'blockchainHash'],
                },
                StripePayment:{
                    paymentIntentId:{
                        type: 'string',
                    },
                    amount:{
                        type: 'number',
                    },
                    currency:{
                        type: 'string',
                        enum: ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'JPY'],
                        default: 'USD',
                    },
                    status:{
                        type: 'string',
                    },
                    lastUpdated:{
                        type: 'string',
                        format: 'date-time',
                    },
                    required:['paymentIntendId', 'amount', 'currency', 'status', 'lastUpdated'],
                },
                PayPalTransaction: {
                    type: 'object',
                    properties: {
                        paymentId: {

                            type: 'string',
                        },
                        amount: {       
                            type: 'number',
                        },
                        status: {
                            type: 'string',
                            enum: ['PENDING', 'COMPLETED', 'FAILED'],
                            default: 'PENDING',
                        },
                    },
                    required: ['paymentId', 'amount', 'status'],
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