import ProjectsModel from "../../Model/ProjectsModel.js";
import cloudinary from '../../../utls/Cloudinary.js';

import { AddFieldsWithOutToken } from '../../../ExternalApiFields/ExternealApiFields.controller.js';
import  Skills  from "../../../ExternalApiSkills/ExternealApiSkills.controller.js";

export const CreateProject = async (req, res) => {
    try {
        const {
            ProjectName,
            Description,
            FieldId,
            DurationInMounths,
            PositionRole,
            WorkLoaction,
            Benefits,
            Price,
        } = req.body;

        const CreatedBySenior = req.user._id;

        // التحقق من القيم المطلوبة
        if (!FieldId) {
            return res.status(400).json({ message: "Field ID is required." });
        }

        // استخراج المهارات (skillsArray) من req.body
        const skillsArray = [];
        Object.keys(req.body).forEach((key) => {
            const match = key.match(/^skillsArray\[(\d+)\]\.(id|Rate)$/); // مطابقة مفتاح skillsArray[i].id أو skillsArray[i].Rate
            if (match) {
                const index = parseInt(match[1], 10); // استخراج رقم المهارة
                const field = match[2]; // استخراج الحقل (id أو Rate)

                if (!skillsArray[index]) {
                    skillsArray[index] = {}; // إنشاء عنصر جديد إذا لم يكن موجودًا
                }
                skillsArray[index][field] = req.body[key]; // تعيين القيمة للحقل المناسب
            }
        });

        // استخراج تفاصيل المهارات
        const parsedSkills = skillsArray
            .filter((skill) => skill.id && skill.Rate) // التأكد من وجود id و Rate
            .map((skill) => {
                const skillDetails = Skills.find((s) => s.id === parseInt(skill.id, 10)); // البحث عن المهارة حسب id
                return {
                    id: parseInt(skill.id, 10),
                    Rate: parseInt(skill.Rate, 10),
                    name: skillDetails?.name || "Unknown",
                    code: skillDetails?.code || "Unknown",
                };
            });

        // استخراج الأدوار (Roles) من req.body
        const rolesArray = [];
        Object.keys(req.body).forEach((key) => {
            const match = key.match(/^Roles\[(\d+)\]\.roleName$/); // مطابقة المفتاح Roles[i].roleName
            if (match) {
                const index = parseInt(match[1], 10); // استخراج رقم الدور
                if (!rolesArray[index]) {
                    rolesArray[index] = { users: [] }; // إنشاء عنصر جديد إذا لم يكن موجودًا
                }
                rolesArray[index].roleName = req.body[key]; // تعيين اسم الدور
            }
        });

        // التأكد من وجود roleName
        const parsedRoles = rolesArray.filter((role) => role.roleName); // التأكد من أن roleName موجود

        // استدعاء الحقل باستخدام الدالة AddFieldsWithOutToken
        const fieldToAdd = await AddFieldsWithOutToken(FieldId.toString());

        // رفع الملفات إلى Cloudinary
        const FileProject = req.files?.['FileProject']
            ? await Promise.all(
                  req.files['FileProject'].map(async (file) => {
                      const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                          folder: `GraduationProject1-Software/Project/FileProject/${CreatedBySenior}`,
                      });

                      return {
                          secure_url,
                          public_id,
                          originalname: file.originalname,
                      };
                  })
              )
            : [];

        // إنشاء المشروع في قاعدة البيانات
        const project = await ProjectsModel.create({
            ProjectName,
            Description,
            RequiredSkills: parsedSkills, // إضافة المهارات إلى المشروع
            Roles: parsedRoles, // إضافة الأدوار إلى المشروع
            Fields: { id: fieldToAdd.id, sub_specialization: fieldToAdd.sub_specialization, code: fieldToAdd.code },
            CreatedBySenior,
            DurationInMounths,
            WorkLoaction,
            Benefits,
            Price,
            FileProject,
        });

        return res.status(201).json({
            message: 'Project created successfully',
            project,
        });
    } catch (error) {
        console.error("Error creating project:", error.message);
        return res.status(500).json({
            message: 'Error creating project',
            error: error.message,
        });
    }
};


  
//  View Own Project Created
export const GetProjectsBySenior = async (req, res) => {
    
        const CreatedBySenior = req.user._id; 
        const projects = await ProjectsModel.find({ CreatedBySenior });

        
        if (!projects.length) {
            return res.status(404).json({ message: "No projects found for this senior." });
    } 
    return res.status(200).json({ projects });
      
    
};
 
 // Edit Own Project Created
 export const UpdateProjectBySenior = async (req, res) => {
        try {
            const {
                ProjectId, // معرف المشروع الذي سيتم تحديثه
                ProjectName,
                Description,
                FieldId,
                DurationInMounths,
                PositionRole,
                WorkLoaction,
                Benefits,
                Price,
            } = req.body;
    
            const UpdatedBySenior = req.user._id;
    
            // التحقق من وجود معرف المشروع
            if (!ProjectId) {
                return res.status(400).json({ message: "Project ID is required." });
            }
    
            // التحقق من الحقول المطلوبة
            if (!FieldId) {
                return res.status(400).json({ message: "Field ID is required." });
            }
    
            // استخراج المهارات (skillsArray) من req.body
            const skillsArray = [];
            Object.keys(req.body).forEach((key) => {
                const match = key.match(/^skillsArray\[(\d+)\]\.(id|Rate)$/);
                if (match) {
                    const index = parseInt(match[1], 10);
                    const field = match[2];
    
                    if (!skillsArray[index]) {
                        skillsArray[index] = {};
                    }
                    skillsArray[index][field] = req.body[key];
                }
            });
    
            const parsedSkills = skillsArray
                .filter((skill) => skill.id && skill.Rate)
                .map((skill) => {
                    const skillDetails = Skills.find((s) => s.id === parseInt(skill.id, 10));
                    return {
                        id: parseInt(skill.id, 10),
                        Rate: parseInt(skill.Rate, 10),
                        name: skillDetails?.name || "Unknown",
                        code: skillDetails?.code || "Unknown",
                    };
                });
    
            // استخراج الأدوار (Roles) من req.body
            const rolesArray = [];
            Object.keys(req.body).forEach((key) => {
                const match = key.match(/^Roles\[(\d+)\]\.roleName$/);
                if (match) {
                    const index = parseInt(match[1], 10);
                    if (!rolesArray[index]) {
                        rolesArray[index] = { users: [] };
                    }
                    rolesArray[index].roleName = req.body[key];
                }
            });
    
            const parsedRoles = rolesArray.filter((role) => role.roleName);
    
            // استدعاء الحقل باستخدام الدالة AddFieldsWithOutToken
            const fieldToUpdate = await AddFieldsWithOutToken(FieldId.toString());
    
            // رفع الملفات إلى Cloudinary (إن وجدت)
            const FileProject = req.files?.['FileProject']
                ? await Promise.all(
                      req.files['FileProject'].map(async (file) => {
                          const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                              folder: `GraduationProject1-Software/Project/FileProject/${UpdatedBySenior}`,
                          });
    
                          return {
                              secure_url,
                              public_id,
                              originalname: file.originalname,
                          };
                      })
                  )
                : [];
    
            // تحديث المشروع في قاعدة البيانات
            const updatedProject = await ProjectsModel.findByIdAndUpdate(
                ProjectId,
                {
                    ProjectName,
                    Description,
                    RequiredSkills: parsedSkills,
                    Roles: parsedRoles,
                    Fields: { id: fieldToUpdate.id, sub_specialization: fieldToUpdate.sub_specialization, code: fieldToUpdate.code },
                    UpdatedBySenior,
                    DurationInMounths,
                    PositionRole,
                    WorkLoaction,
                    Benefits,
                    Price,
                    FileProject,
                },
                { new: true } // إرجاع المستند بعد التحديث
            );
    
            if (!updatedProject) {
                return res.status(404).json({ message: "Project not found." });
            }
    
            return res.status(200).json({
                message: 'Project updated successfully',
                project: updatedProject,
            });
        } catch (error) {
            console.error("Error updating project:", error.message);
            return res.status(500).json({
                message: 'Error updating project',
                error: error.message,
            });
        }
    };
    


// Delete Own Project Created
export const DeleteProjectBySenior = async (req, res) => {
    const { ProjectId } = req.params; 
    const CreatedBySenior = req.user._id; 

  
    const deletedProject = await ProjectsModel.findOneAndDelete({
        _id: ProjectId,
        CreatedBySenior
    });

    
    if (!deletedProject) {
        return res.status(404).json({ message: "Project not found or you are not authorized to delete this project." });
    }

    return res.status(200).json({ message: "Project deleted successfully." });
};

 // View other people's Project in all fileds

 export const GetProjectsByField = async (req, res) => {
    try {
        const { FieldId } = req.params; // استخراج FieldId من المعاملات (params)

        // التحقق من وجود FieldId
        if (!FieldId) {
            return res.status(400).json({ message: "Field ID is required." });
        }

        // البحث عن المشاريع بناءً على FieldId
        const projects = await ProjectsModel.find({ "Fields.id": FieldId });

        // التحقق إذا لم يتم العثور على مشاريع
        if (!projects || projects.length === 0) {
            return res.status(404).json({ message: "No projects found for the given Field ID." });
        }

        // إرجاع المشاريع
        return res.status(200).json({
            message: "Projects retrieved successfully",
            projects,
        });
    } catch (error) {
        console.error("Error retrieving projects by FieldId:", error.message);
        return res.status(500).json({
            message: "Error retrieving projects",
            error: error.message,
        });
    }
};


 
 
