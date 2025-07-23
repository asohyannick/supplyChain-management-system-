import * as Yup from 'yup';
import { UserStatus } from '../serviceImplementators/user/user.interfac';
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

const dronePickUpSchema = Yup.object().shape({
    userId: Yup.string().trim().optional(), 
    pickupTime: Yup.date().default(() => new Date()),
    address: addressSchema,
    notes: Yup.string().trim().required('Notes are required'),
    packageDetails: Yup.array().of(packageDetailsSchema).required('Package details are required'),
});
const updateDronePickUpSchema = Yup.object().shape({
    userId: Yup.string().trim().optional(), 
    pickupTime: Yup.date().default(() => new Date()),
    address: addressSchema,
    notes: Yup.string().trim().required('Notes are required'),
    packageDetails: Yup.array().of(packageDetailsSchema).required('Package details are required'),
});

export {
    userValidationSchema,
    userLoginValidationSchema,
    updateUserValidationSchema,
    dronePickUpSchema,
    updateDronePickUpSchema,
}