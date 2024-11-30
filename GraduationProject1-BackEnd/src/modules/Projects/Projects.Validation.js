import Joi from 'joi';

export const CreateProjectSchema = Joi.object({
    ProjectName: Joi.string().required(),
    Description: Joi.string().required(),
    RequiredSkills: Joi.array().items(Joi.string()).required(),
    Field: Joi.string().required(),
    DurationInMounths:Joi.number().required(),
    PositionRole:Joi.array().items(Joi.string()).required(),

});

export const UpdateProjectSchema = Joi.object({
    ProjectName: Joi.string().optional(),
    Description: Joi.string().optional(),
    RequiredSkills: Joi.array().items(Joi.string()).optional(),
    DurationInMounths:Joi.number().required(),
    ProjectId: Joi.string().required(),
    PositionRole:Joi.array().items(Joi.string()).required(),


});

export const DeleteProjectSchema = Joi.object({
    ProjectId: Joi.string().required()
});

export const GetProjectsByFieldSchema = Joi.object({
    Field: Joi.string().required()
});
