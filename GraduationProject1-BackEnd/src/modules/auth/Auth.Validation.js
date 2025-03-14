import joi from 'joi';


// Registration Schema
export const RegisterSchema = joi.object({
    FullName: joi.string().min(2).max(50).required(),
    Email: joi.string().email().required(),
    Password: joi.string().pattern(/^[A-Z][a-z0-9]{3,20}$/).required(),
    ConfirmPassword: joi.any().valid(joi.ref('Password')).required().messages({ 'any.only': 'Passwords do not match' }),
    Gender: joi.string().valid('Male', 'Female').required(),
    BirthDate: joi.date().less('now').required(),
    PhoneNumber: joi.string().pattern(/^[0-9]+$/).min(10).max(15).required(),
    Location: joi.string().min(2).max(50).required(),
    YearsOfExperience: joi.number().integer().min(0).required(),
    Field: joi.string().valid('IT',
        'Digital Marketing',
        'Decor Design',
        'Graphic Design',
        'Software Engineer',
        'Data Scientist',
        'Product Manager',
        'UX/UI Designer',
        'Marketing Specialist',
        'Business Analyst',
        'DevOps Engineer',
        'QA Tester').required()
});

// Login Schema
export const LoginSchema = joi.object({
    Email: joi.string().email().required(),
    Password: joi.string().pattern(/^[A-Z][a-z0-9]{3,20}$/).required(),
});

// Send Code Schema
export const SendCodeSchema = joi.object({
    Email: joi.string().email().required(),
});

// Forget Password Schema
export const ForgetPasswordSchema = joi.object({
    Password: joi.string().pattern(/^[A-Z][a-z0-9]{3,20}$/),
    Email: joi.string().email().required(),
    code: joi.string().length(4),
});