import Joi from 'joi';

// Schema لإنشاء مشروع جديد
export const CreateProjectSchema = Joi.object({
    ProjectName: Joi.string().required(),
    Description: Joi.string().required(),
    RequiredSkills: Joi.array().items(
        Joi.object({
            id: Joi.number().required(),
            name: Joi.string().required(),
            code: Joi.string().required(),
            Rate: Joi.number().min(1).max(5).required(),
        })
    ).required(),
    Fields: Joi.array().items(
        Joi.object({
            id: Joi.number().required(),
            sub_specialization: Joi.string().required(),
            code: Joi.string().required(),
        })
    ).required(),
    DurationInMounths: Joi.number().required(),
    PositionRole: Joi.array().items(Joi.string()).required(),
    WorkLoaction: Joi.string().optional(),
    Benefits: Joi.string().optional(),
    Price: Joi.string().optional(),
    ProjectFile: Joi.array().items(Joi.object({
        secure_url: Joi.string().uri().required(),
        public_id: Joi.string().required(),
    })).optional(),
});

// Schema لتحديث مشروع موجود
export const UpdateProjectSchema = Joi.object({
    ProjectName: Joi.string().optional(),
    Description: Joi.string().optional(),
    RequiredSkills: Joi.array().items(
        Joi.object({
            id: Joi.number().required(),
            name: Joi.string().required(),
            code: Joi.string().required(),
            Rate: Joi.number().min(1).max(5).required(),
        })
    ).optional(),
    DurationInMounths: Joi.number().required(),
    ProjectId: Joi.string().required(),
    PositionRole: Joi.array().items(Joi.string()).required(),
    WorkLoaction: Joi.string().optional(),
    Benefits: Joi.string().optional(),
    Price: Joi.string().optional(),
    ProjectFile: Joi.array().items(Joi.object({
        secure_url: Joi.string().uri().required(),
        public_id: Joi.string().required(),
    })).optional(),
});

// Schema لحذف مشروع
export const DeleteProjectSchema = Joi.object({
    ProjectId: Joi.string().required()
});

// Schema للحصول على المشاريع بناءً على الـ FieldId
export const GetProjectsByFieldSchema = Joi.object({
    FieldId: Joi.string().required() // تعديل من "Field" إلى "FieldId" بما يتناسب مع الـ params في الرابط
});
