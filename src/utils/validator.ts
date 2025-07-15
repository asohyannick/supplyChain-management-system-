import * as Yup from 'yup';
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

    isAdmin: Yup.boolean()
        .required('Admin status is required').default(false),
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

})

export {
    userValidationSchema,
    userLoginValidationSchema,
}