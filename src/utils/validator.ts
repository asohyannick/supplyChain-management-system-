import * as Yup from 'yup';
import { UserStatus } from '../serviceImplementators/user/user.interfac';
import { Types } from 'mongoose';
import { Currency, PaymentStatus } from '../enums/stripe/stripe.constants';
const userValidationSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters long')
        .max(50, 'First name cannot exceed 50 characters')
        .trim(),

    lastName: Yup.string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters long')
        .max(50, 'Last name cannot exceed 50 characters')
        .trim(),

    email: Yup.string()
        .required('Email is required')
        .email('Email must be a valid email address')
        .max(100, 'Email cannot exceed 100 characters')
        .trim(),

    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .max(100, 'Password cannot exceed 100 characters')
        .trim(),

    role: Yup.mixed<UserStatus>()
        .oneOf(Object.values(UserStatus), 'Invalid user status')
        .required('User status is required'),
    biometricData: Yup.string()
        .required('Biometric data is required')
        .matches(/^[A-Za-z0-9+/=]*$/, 'Invalid biometric data format'), 

});

const userLoginValidationSchema = Yup.object().shape({
    email: Yup.string()
        .required('Email is required')
        .email('Email must be a valid email address')
        .max(100, 'Email cannot exceed 100 characters')
        .trim(),

    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .max(100, 'Password cannot exceed 100 characters')
        .trim(),
});

const updateUserValidationSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters long')
        .max(50, 'First name cannot exceed 50 characters')
        .trim(),

    lastName: Yup.string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters long')
        .max(50, 'Last name cannot exceed 50 characters')
        .trim(),

    email: Yup.string()
        .required('Email is required')
        .email('Email must be a valid email address')
        .max(100, 'Email cannot exceed 100 characters')
        .trim(),

    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .max(100, 'Password cannot exceed 100 characters')
        .trim(),
    role: Yup.mixed<UserStatus>()
        .oneOf(Object.values(UserStatus), 'Invalid user status')
        .required('User status is required'),
});

const addressSchema = Yup.object().shape({
    street: Yup.string().trim().required('Street is required'),
    city: Yup.string().trim().required('City is required'),
    state: Yup.string().trim().required('State is required'),
    zipCode: Yup.string().trim().required('Zip code is required'),
    country: Yup.string().trim().default('').required('Country is required'),
});

const packageDetailsSchema = Yup.object().shape({
    weight: Yup.number().required('Weight is required'),
    dimensions: Yup.object().shape({
        length: Yup.number().required('Length is required'),
        width: Yup.number().required('Width is required'),
        height: Yup.number().required('Height is required'),
    }),
    description: Yup.string().trim().required('Description is required'),
});

const droneSchema = Yup.object().shape({
    userId: Yup.string().trim().optional(),
    pickupTime: Yup.date().default(() => new Date()),
    address: addressSchema,
    notes: Yup.string().trim().required('Notes are required'),
    packageDetails: Yup.array().of(packageDetailsSchema).required('Package details are required'),
    batteryLevel: Yup.number().integer().required('BatteryLevel is required'),
});
const updateDroneSchema = Yup.object().shape({
    userId: Yup.string().trim().optional(),
    pickupTime: Yup.date().default(() => new Date()),
    address: addressSchema,
    notes: Yup.string().trim().required('Notes are required'),
    packageDetails: Yup.array().of(packageDetailsSchema).required('Package details are required'),
    batteryLevel: Yup.number().integer().required('BatteryLevel is required'),
});
const BlockChainDeliverySchema = Yup.object().shape({
      userId: Yup.mixed()
        .required('User ID is required')
        .test('is-objectid', 'User ID must be a valid ObjectId', (value) => {
            return (
                value instanceof Types.ObjectId || 
                (typeof value === 'string' && Types.ObjectId.isValid(value))
            );
        }),
    deliveryDetails: Yup.string()
        .required('Delivery details are required')
        .max(500, 'Delivery details cannot exceed 500 characters'),
    timestamp: Yup.date()
        .required('Timestamp is required')
        .max(new Date(), 'Timestamp cannot be in the future'),
    blockchainHash: Yup.string()
        .required('Blockchain hash is required')
        .matches(/^0x[a-fA-F0-9]{40}$/, 'Blockchain hash must be a valid Ethereum address format')
});
const updateBlockChainDeliverySchema = Yup.object().shape({
      userId: Yup.mixed()
        .required('User ID is required')
        .test('is-objectid', 'User ID must be a valid ObjectId', (value) => {
            return (
                value instanceof Types.ObjectId || 
                (typeof value === 'string' && Types.ObjectId.isValid(value))
            );
        }),
    deliveryDetails: Yup.string()
        .required('Delivery details are required')
        .max(500, 'Delivery details cannot exceed 500 characters'),
    timestamp: Yup.date()
        .required('Timestamp is required')
        .max(new Date(), 'Timestamp cannot be in the future'),
    blockchainHash: Yup.string()
        .required('Blockchain hash is required')
        .matches(/^0x[a-fA-F0-9]{40}$/, 'Blockchain hash must be a valid Ethereum address format')
});
const stripePaymentSchema = Yup.object().shape({
    amount: Yup.number().required('The amount must be provided').integer(),
    currency: Yup.mixed().required('A valid currency must be provided').oneOf(Object.values(Currency)),
    status: Yup.mixed().optional().oneOf(Object.values(PaymentStatus)),
    lastUpdated: Yup.date().optional(),
});
const updatedStripePaymentSchema = Yup.object().shape({
    amount: Yup.number().required('The amount must be provided').integer(),
    currency: Yup.mixed().required('A valid currency must be provided').oneOf(Object.values(Currency)),
    status: Yup.mixed().optional().oneOf(Object.values(PaymentStatus)),
    lastUpdated: Yup.date().optional(),
});
const subscriptionSchema = Yup.object().shape({
      userId: Yup.string()
        .required('User ID is required')
        .test('is-objectid', 'User ID must be a valid ObjectId', (value) => {
            if (!value) return false; // Handle null or undefined
            // Only check if it's a valid ObjectId if it's a string
            return typeof value === 'string' && Types.ObjectId.isValid(value);
        }),
    subscription: Yup.object().shape({
        endpoint: Yup.string().required('Endpoint is required'),
        keys: Yup.object().shape({
            p256dh: Yup.string().required('p256dh key is required'),
            auth: Yup.string().required('Auth key is required'),
        }),
    }),
});
const updateSubscriptionSchema = Yup.object().shape({
    userId: Yup.string()
        .required('User ID is required')
        .test('is-objectid', 'User ID must be a valid ObjectId', (value) => {
            if (!value) return false; // Handle null or undefined
            // Only check if it's a valid ObjectId if it's a string
            return typeof value === 'string' && Types.ObjectId.isValid(value);
        }),   
    subscription: Yup.object().shape({
        endpoint: Yup.string().required('Endpoint is required'),
        keys: Yup.object().shape({  
            p256dh: Yup.string().required('P256DH key is required'),                
            auth: Yup.string().required('Auth key is required'),
        }),
    }).required('Subscription data is required'),
});

const pushNotificationSchema = Yup.object().shape({
        subscription: Yup.object().shape({
        endpoint: Yup.string().required('Endpoint is required'),
        keys: Yup.object().shape({  
            p256dh: Yup.string().required('P256DH key is required'),                
            auth: Yup.string().required('Auth key is required'),
        }),
    }).required('Subscription data is required'),
});

const stripePaymentValidationSchema = Yup.object().shape({
    paymentIntentId: Yup.string()
        .trim()
        .optional(), // optional since it can be undefined

    amount: Yup.number()
        .required('Amount is required')
        .positive('Amount must be a positive number'),

    currency: Yup.string()
        .trim()
        .oneOf(Object.values(Currency), 'Invalid currency')
        .default(Currency.EURO), // default value

    status: Yup.string()
        .trim()
        .oneOf(Object.values(PaymentStatus), 'Invalid payment status')
        .default(PaymentStatus.PENDING), // default value

    lastUpdated: Yup.date()
        .default(() => new Date())
});
export {
    userValidationSchema,
    userLoginValidationSchema,
    updateUserValidationSchema,
    droneSchema,
    updateDroneSchema,
    BlockChainDeliverySchema,
    updateBlockChainDeliverySchema,
    stripePaymentSchema,
    updatedStripePaymentSchema,
    subscriptionSchema,
    updateSubscriptionSchema,
    pushNotificationSchema,
    stripePaymentValidationSchema,
}