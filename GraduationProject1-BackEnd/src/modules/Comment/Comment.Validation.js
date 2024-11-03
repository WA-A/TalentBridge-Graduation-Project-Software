import Joi from 'joi';

export const CreateCommentSchema = Joi.object({
    Text: Joi.string().min(1).required(), 
    images: Joi.array().items(Joi.object({
        secure_url: Joi.string().uri().required(), 
        public_id: Joi.string().required(), 
    })).optional(),
    videos: Joi.array().items(Joi.object({
        secure_url: Joi.string().uri().required(), 
        public_id: Joi.string().required(), 
    })).optional(),
    files: Joi.array().items(Joi.object({
        secure_url: Joi.string().uri().required(), 
        public_id: Joi.string().required(), 
    })).optional(),
});

export const UpdateCommentSchema = Joi.object({
    Text: Joi.string().min(1).optional(), 
    images: Joi.array().items(Joi.object({
        secure_url: Joi.string().uri().required(),
        public_id: Joi.string().required(),
    })).optional(),
    videos: Joi.array().items(Joi.object({
        secure_url: Joi.string().uri().required(),
        public_id: Joi.string().required(),
    })).optional(),
    files: Joi.array().items(Joi.object({
        secure_url: Joi.string().uri().required(),
        public_id: Joi.string().required(),
    })).optional(),
});
