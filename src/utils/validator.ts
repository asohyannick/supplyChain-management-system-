import * as Yup from 'yup';
import { UserStatus } from '../enums/user/user.constants';
import { Types } from 'mongoose';
import { Currency, PaymentStatus } from '../enums/stripe/stripe.constants';
import { DroneStatus } from '../enums/drone/drone.constants';
import { PromoCodeGenerationConstants } from '../enums/promoCodeGeneration/promoCodeGeneration.constants';
const PASSWORD_REGEX = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
);
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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
        .trim().matches(EMAIL_REGEX, 'Email must be a valid email address'),

    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .max(100, 'Password cannot exceed 100 characters')
        .trim()
        .matches(PASSWORD_REGEX, {
            message: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
            excludeEmptyString: true,
        }),
    role: Yup.mixed<UserStatus>()
        .oneOf(Object.values(UserStatus), 'Invalid user status')
        .required('User status is required'),
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
        .trim()
        .matches(EMAIL_REGEX, 'Email must be a valid email address'),

    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .max(100, 'Password cannot exceed 100 characters')
        .trim()
        .matches(PASSWORD_REGEX, {
            message: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
            excludeEmptyString: true,
        }),
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

const userProfileValidationSchema = Yup.object().shape({
    userId: Yup.string().required("User ID is required."),
    firstName: Yup.string()
        .required("First name is required.")
        .min(2, "First name must be at least 2 characters long.")
        .max(50, "First name cannot exceed 50 characters."),
    lastName: Yup.string()
        .required("Last name is required.")
        .min(2, "Last name must be at least 2 characters long.")
        .max(50, "Last name cannot exceed 50 characters."),
    email: Yup.string()
        .required("Email is required.")
        .email("Email is not valid."),
    password: Yup.string()
        .required("Password is required.")
        .min(8, "Password must be at least 8 characters long."),
    role: Yup.string()
        .oneOf(Object.values(UserStatus), "Role must be one of the predefined values.")
        .default(UserStatus.USER),
    profilePicture: Yup.string()
        .url("Profile picture must be a valid URL."),
    bio: Yup.string()
        .max(500, "Bio cannot exceed 500 characters."),
    drones: Yup.array().of(
        Yup.object().shape({
            droneId: Yup.string().required("Drone ID is required."),
            status: Yup.string()
                .oneOf(Object.values(DroneStatus), "Status must be one of the predefined values.")
                .default(DroneStatus.OFFLINE),
            pickupTime: Yup.date().default(() => new Date()),
            distance: Yup.number().min(0, "Distance must be a positive number."),
            location: Yup.object().shape({
                latitude: Yup.number()
                    .required("Latitude is required.")
                    .min(-90, "Latitude must be between -90 and 90.")
                    .max(90, "Latitude must be between -90 and 90."),
                longitude: Yup.number()
                    .required("Longitude is required.")
                    .min(-180, "Longitude must be between -180 and 180.")
                    .max(180, "Longitude must be between -180 and 180."),
            }),
            address: Yup.object().shape({
                street: Yup.string().required("Street is required."),
                city: Yup.string().required("City is required."),
                state: Yup.string().required("State is required."),
                zipCode: Yup.string().required("Zip code is required."),
                country: Yup.string().required("Country is required."),
            }),
            notes: Yup.string(),
            packageDetails: Yup.array().of(
                Yup.object().shape({
                    weight: Yup.number()
                        .required("Weight is required.")
                        .min(0, "Weight must be a positive number."),
                    dimensions: Yup.object().shape({
                        length: Yup.number().required("Length is required.").min(0, "Length must be a positive number."),
                        width: Yup.number().required("Width is required.").min(0, "Width must be a positive number."),
                        height: Yup.number().required("Height is required.").min(0, "Height must be a positive number."),
                    }),
                    description: Yup.string().required("Description is required."),
                })
            ),
            batteryLevel: Yup.number().min(0).max(100).required("Battery level is required."),
        })
    ),
});

const updateUserProfileValidationSchema = Yup.object().shape({
    userId: Yup.string().required("User ID is required."),
    firstName: Yup.string()
        .required("First name is required.")
        .min(2, "First name must be at least 2 characters long.")
        .max(50, "First name cannot exceed 50 characters."),
    lastName: Yup.string()
        .required("Last name is required.")
        .min(2, "Last name must be at least 2 characters long.")
        .max(50, "Last name cannot exceed 50 characters."),
    email: Yup.string()
        .required("Email is required.")
        .email("Email is not valid."),
    password: Yup.string()
        .required("Password is required.")
        .min(8, "Password must be at least 8 characters long."),
    role: Yup.string()
        .oneOf(Object.values(UserStatus), "Role must be one of the predefined values.")
        .default(UserStatus.USER),
    profilePicture: Yup.string()
        .url("Profile picture must be a valid URL."),
    bio: Yup.string()
        .max(500, "Bio cannot exceed 500 characters."),
    drones: Yup.array().of(
        Yup.object().shape({
            droneId: Yup.string().required("Drone ID is required."),
            status: Yup.string()
                .oneOf(Object.values(DroneStatus), "Status must be one of the predefined values.")
                .default(DroneStatus.OFFLINE),
            pickupTime: Yup.date().default(() => new Date()),
            distance: Yup.number().min(0, "Distance must be a positive number."),
            location: Yup.object().shape({
                latitude: Yup.number()
                    .required("Latitude is required.")
                    .min(-90, "Latitude must be between -90 and 90.")
                    .max(90, "Latitude must be between -90 and 90."),
                longitude: Yup.number()
                    .required("Longitude is required.")
                    .min(-180, "Longitude must be between -180 and 180.")
                    .max(180, "Longitude must be between -180 and 180."),
            }),
            address: Yup.object().shape({
                street: Yup.string().required("Street is required."),
                city: Yup.string().required("City is required."),
                state: Yup.string().required("State is required."),
                zipCode: Yup.string().required("Zip code is required."),
                country: Yup.string().required("Country is required."),
            }),
            notes: Yup.string(),
            packageDetails: Yup.array().of(
                Yup.object().shape({
                    weight: Yup.number()
                        .required("Weight is required.")
                        .min(0, "Weight must be a positive number."),
                    dimensions: Yup.object().shape({
                        length: Yup.number().required("Length is required.").min(0, "Length must be a positive number."),
                        width: Yup.number().required("Width is required.").min(0, "Width must be a positive number."),
                        height: Yup.number().required("Height is required.").min(0, "Height must be a positive number."),
                    }),
                    description: Yup.string().required("Description is required."),
                })
            ),
            batteryLevel: Yup.number().min(0).max(100).required("Battery level is required."),
        })
    ),
});

const promoCodeValidationSchema = Yup.object().shape({
    code: Yup.string()
        .required('Promo code is required.')
        .min(5, 'Promo code must be at least 5 characters long.')
        .max(20, 'Promo code cannot exceed 20 characters.')
        .matches(/^[A-Z0-9]+$/, 'Promo code must contain only uppercase letters and numbers.'),
    discountType: Yup.string()
        .oneOf(Object.values(PromoCodeGenerationConstants), 'Invalid discount type.')
        .default(PromoCodeGenerationConstants.PERCENTAGE),
    discountValue: Yup.number()
        .required('Discount value is required.')
        .min(0, 'Discount value must be at least 0.')
        .test('is-valid-discount', 'Invalid discount value.', function(value) {
            const { discountType } = this.parent;
            if (discountType === PromoCodeGenerationConstants.PERCENTAGE) {
                return value >= 0 && value <= 100; 
            }
            return value >= 0;
        }),
    expirationDate: Yup.date()
        .required('Expiration date is required.')
        .min(new Date(), 'Expiration date must be in the future.'),
    requestedBy: Yup.string()
        .required('Requested by is required.')
        .length(24, 'Requested by must be a valid MongoDB ObjectId.'),
});

const reviewValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .matches(EMAIL_REGEX).required('Email is required')
    .test('unique', 'Email must be unique', async (value) => {
      const exists = await Review.exists({ email: value });
      return !exists;
    }),
  feature: Yup.string().required('Feature is required'),
  date: Yup.date().default(() => new Date()),
  usabilityRating: Yup.string().required('Usability rating is required'),
  message: Yup.string().required('Message is required'),
});

const updateReviewValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .matches(EMAIL_REGEX).required('Email is required')
    .test('unique', 'Email must be unique', async (value) => {
      const exists = await Review.exists({ email: value });
      return !exists;
    }),
  feature: Yup.string().required('Feature is required'),
  date: Yup.date().default(() => new Date()),
  usabilityRating: Yup.string().required('Usability rating is required'),
  message: Yup.string().required('Message is required'),
});

const biometricDataSchema = Yup.object().shape({
    userId: Yup.string()
        .required('User ID is required')
        .test('is-valid-objectid', 'User ID must be a valid ObjectId', (value) => {
            return Types.ObjectId.isValid(value);
        }),
    fingerprint: Yup.string()
        .required('Fingerprint data is required'),
    facialRecognition: Yup.string()
        .required('Facial recognition data is required'),
    irisScan: Yup.string()
        .required('Iris scan data is required'),
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
    userProfileValidationSchema,
    updateUserProfileValidationSchema,
    promoCodeValidationSchema,
    reviewValidationSchema,
    updateReviewValidationSchema,
    biometricDataSchema,
}