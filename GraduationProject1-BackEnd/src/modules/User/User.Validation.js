import joi from 'joi';

export const CreateProfileSchema = joi.object({
    About: joi
        .string()
        .min(10)
        .max(100)
        .required()
        .messages({
            'string.base': 'The About field must be a text.',
            'string.empty': 'The About field cannot be empty.',
            'string.min': 'The About field must be at least 10 characters long.',
            'string.max': 'The About field cannot exceed 100 characters.',
            'any.required': 'The About field is required.',
        }),
    Bio: joi
        .string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.base': 'The Bio field must be a text.',
            'string.empty': 'The Bio field cannot be empty.',
            'string.min': 'The Bio field must be at least 3 characters long.',
            'string.max': 'The Bio field cannot exceed 100 characters.',
            'any.required': 'The Bio field is required.',
        }),
    PictureProfile: joi
        .object({
            fieldname: joi.string().required(),
            originalname: joi.string().required(),
            encoding: joi.string().required(),
            mimetype: joi.string().valid('image/png', 'image/jpeg', 'image/webp').required(),
            destination: joi.string().required(),
            filename: joi.string().required(),
            path: joi.string().required(),
            size: joi.number().max(1000000).required(),
        })
        .required()
        .messages({
            'object.base': 'The PictureProfile must be a valid object.',
            'any.required': 'The PictureProfile field is required.',
        }),
});



export const UpdateProfileSchema = joi.object({
    Id:joi.string().hex().length(24),
    Bio: joi.string().min(10).max(100).required(),
    About: joi.string().min(10).max(100).required(),
    PictureProfile: joi.object({
    fieldname: joi.string().required(),
    originalname: joi.string().required(),
    encoding: joi.string().required(),
    mimetype: joi.string().valid('image/png','image/jpeg','image/webp').required(),
    destination: joi.string().required(),
    filename:joi.string().required(),
    path: joi.string().required(),
    size:joi.number().max(1000000).required()
    }).optional(),
    });

