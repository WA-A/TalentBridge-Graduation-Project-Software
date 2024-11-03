import Joi from 'joi';

export const CreatePostSchema = Joi.object({
    Title: Joi.string().min(3).max(100).required(),
    Body: Joi.string().min(10).required(),
    images: Joi.array().items(Joi.object({
        secure_url: Joi.string().uri().required(),
        public_id: Joi.string().required(),
    })).optional(),
    videos: Joi.array().items(Joi.object({
        secure_url: Joi.string().uri().required(),
        public_id: Joi.string().required(),
    })).optional(),
    files: Joi.array().items(Joi.object({
        file_url: Joi.string().uri().required(),
    })).optional(),
    ProfileImage: Joi.string().uri().optional()
});

export const UpdatePostSchema = Joi.object({
    Title: Joi.string().min(3).max(100).optional(),
    Body: Joi.string().min(10).optional(),
    images: Joi.array().items(Joi.object({
        secure_url: Joi.string().uri().optional(),
        public_id: Joi.string().optional(),
    })).optional(),
    videos: Joi.array().items(Joi.object({
        secure_url: Joi.string().uri().optional(),
        public_id: Joi.string().optional(),
    })).optional(),
    files: Joi.array().items(Joi.object({
        file_url: Joi.string().uri().optional(),
    })).optional(),
    ProfileImage: Joi.string().uri().optional()
});
