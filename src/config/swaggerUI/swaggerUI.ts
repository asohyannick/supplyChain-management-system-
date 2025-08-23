import { Application } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';
import { DroneStatus } from "../../enums/drone/drone.constants";
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'SupplyChainManagementSystem Restful APIs Documentation',
            version: '1.0.0',
            description: 'The API documentation provides detailed information about the endpoints, request/response formats, and authentication methods used in the application.',
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
                        qrCodeSecret: {
                            type: 'string',
                        },
                    },
                    required: ['firstName', 'lastName', 'email', 'password', 'role'],
                },
                Profile: {
                    type: 'object',
                    properties: {
                        userId: {
                            type: 'string',
                            description: 'MongoDB ObjectId of the user',
                        },
                        profilePicture: {
                            type: 'string',
                        },
                        bio: {
                            type: 'string',
                        },
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
                        drones: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    droneId: {
                                        type: 'string',
                                    },
                                    status: {
                                        type: 'string',
                                        enum: Object.values(DroneStatus),
                                    },
                                    pickupTime: {
                                        type: 'string',
                                        format: 'date-time',
                                    },
                                    distance: {
                                        type: 'number',
                                    },
                                    location: {
                                        type: 'object',
                                        properties: {
                                            latitude: {
                                                type: 'number',
                                            },
                                            longitude: {
                                                type: 'number',
                                            },
                                        },
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
                                            },
                                            zipCode: {
                                                type: 'string',
                                            },
                                            country: {
                                                type: 'string',
                                            },
                                        },
                                    },
                                    notes: {
                                        type: 'string',
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
                                                },
                                                description: {
                                                    type: 'string',
                                                },
                                            },
                                        },
                                    },
                                    batteryLevel: {
                                        type: 'number',
                                    },
                                },
                            },
                        },
                    },
                    required: ['userId', 'firstName', 'lastName', 'email', 'password', 'role', 'drones'],
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
                StripePayment: {
                    paymentIntentId: {
                        type: 'string',
                    },
                    amount: {
                        type: 'number',
                    },
                    currency: {
                        type: 'string',
                        enum: ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'JPY'],
                        default: 'USD',
                    },
                    status: {
                        type: 'string',
                    },
                    lastUpdated: {
                        type: 'string',
                        format: 'date-time',
                    },
                    required: ['paymentIntendId', 'amount', 'currency', 'status', 'lastUpdated'],
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
                PromoCode: {
                    type: 'object',
                    properties: {
                        code: {
                            type: 'string',
                            unique: true,
                        },
                        discountType: {
                            type: 'string',
                            enum: ['PERCENTAGE', 'FIXED'],
                            default: 'PERCENTAGE',
                        },
                        discountValue: {
                            type: 'number',
                        },
                        expirationDate: {
                            type: 'string',
                            format: 'date-time',
                        },
                        isActive: {
                            type: 'boolean',
                            default: true,
                        },
                        requestedBy: {
                            type: 'string',
                            format: 'objectId',
                        },
                    },
                    required: ['code', 'discountType', 'discountValue', 'expirationDate', 'requestedBy'],
                },
                Review: {
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
                        feature: {
                            type: 'string',
                        },
                        date: {
                            type: 'string',
                            format: 'date-time',
                        },
                        usabilityRating: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                    required: ['firstName', 'lastName', 'email', 'feature', 'date', 'usabilityRating', 'message'],
                },
                BiometricData: {
                    type: 'object',
                    properties: {
                        userId: {
                            type: 'string',
                        },
                        fingerprint: {
                            type: 'string',
                        },
                        facialRecognition: {
                            type: 'string',
                        },
                        irisScan: {
                            type: 'string',
                        },
                    },
                    required: ['userId', 'fingerprint', 'facialRecognition', 'irisScan'],
                },
                Subscription: {
                    type: 'object',
                    properties: {
                        userId: {
                            type: 'string',
                            description: 'MongoDB ObjectId of the user',
                        },
                        subscription: {
                            type: 'object',
                            properties: {
                                endpoint: {
                                    type: 'string',
                                },
                                keys: {
                                    type: 'object',
                                    properties: {
                                        p256dh: {
                                            type: 'string',
                                        },
                                        auth: {
                                            type: 'string',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    required: ['userId', 'subscription'],
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