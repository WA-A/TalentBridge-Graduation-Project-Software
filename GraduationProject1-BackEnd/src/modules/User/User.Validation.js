import joi from 'joi';

export const CreateProfileSchema = joi.object({
    Bio: joi.string().min(10).max(100).required(),
    About: joi.string().min(10).max(100).required(),
    PictureProfile: joi.object({
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().valid('image/png', 'image/jpeg', 'image/webp').required(),
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required(),
        size: joi.number().max(1000000).required(),
    }).required(),
});
