import Joi from 'joi';

export const CreatePostSchema = Joi.object({
    Title: Joi.string().min(3).max(100).required(),
    Body: Joi.string().min(10).required(),
    images: Joi.array().items(Joi.object({
    })).optional(),
    videos: Joi.array().items(Joi.object({
    })).optional(),
    files: Joi.array().items(Joi.object({
    })).optional()
});

export const UpdatePostSchema = Joi.object({
    Title: Joi.string().min(3).max(100).optional(),
    Body: Joi.string().min(10).optional(),
    images: Joi.array().optional(),
    videos: Joi.array().optional(),
    files: Joi.array().optional()
});


