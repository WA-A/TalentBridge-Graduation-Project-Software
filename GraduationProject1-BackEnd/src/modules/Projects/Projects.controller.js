import ProjectsModel from "../../Model/ProjectsModel.js";
import cloudinary from '../../../utls/Cloudinary.js';
import UserModel from "../../Model/User.Model.js";
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
            isAutoApproval,   // إضافة حقل الموافقة التلقائية
            maxAutoApproved,  // إضافة حقل الحد الأقصى للطلبات التلقائية
        } = req.body;

        const CreatedBySenior = req.user._id;

        // التحقق من القيم المطلوبة
        if (!FieldId) {
            return res.status(400).json({ message: "Field ID is required." });
        }

        // تحويل السعر إلى رقم عشري قبل تخزينه
        const price = parseFloat(Price);  // تأكد من أن السعر رقم عشري

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
         
            // Tasks in project 
            
            const tasksArray = [];
        Object.keys(req.body).forEach((key) => {
            const match = key.match(/^Tasks\[(\d+)\]\.(PhaseName|TaskName|Description|TaskRoleName|Priority|StartDate|EndDate|BenefitFromPhase)$/); 
            if (match) {
                const index = parseInt(match[1], 10); 
                const field = match[2]; 

                if (!tasksArray[index]) {
                    tasksArray[index] = {}; 
                }
                tasksArray[index][field] = req.body[key]; 
            }
        });

            const ParsedTasks = tasksArray.filter((task) => 
                task.PhaseName && 
                task.TaskName && 
                task.Description && 
                //task.AssignedTo && 
                task.TaskRoleName && 
               // task.TaskStatus && 
                task.Priority && 
                task.StartDate && 
                task.EndDate &&
               // task.TaskFile &&
                //task.SubmitTaskMethod &&
                task.BenefitFromPhase 
            );
            
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
            Price: price, // استخدام السعر المحول
            FileProject,
            Tasks: ParsedTasks,
            AutoApprovalSettings: {
                isAutoApproval: isAutoApproval || false,  // تحديد إذا كان التفعيل أو لا
                maxAutoApproved: maxAutoApproved || 0,   // تحديد الرقم
            },
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


  
export const GetProjectsBySenior = async (req, res) => {
    const CreatedBySenior = req.user._id;

    try {
        // البحث عن المشاريع الخاصة بهذا senior مع ترتيبها حسب التاريخ من الأحدث إلى الأقدم
        const projects = await ProjectsModel.find({ CreatedBySenior })
            .sort({ created_at: -1 }) // -1 يعني الترتيب من الأحدث إلى الأقدم
            .populate("CreatedBySenior", "FullName PictureProfile role"); // إضافة populate لجلب بيانات السينيور مثل الاسم والصورة والدور

        if (!projects.length) {
            return res.status(404).json({ message: "No projects found for this senior." });
        }

        // إعادة المشاريع مع تفاصيل السينيور
        return res.status(200).json({
            message: "Projects retrieved successfully",
            projects: projects.map(project => ({
                ...project.toObject(), // تحويل المشروع إلى كائن عادي لتعديل القيم
                senior: project.CreatedBySenior ? {
                    name: project.CreatedBySenior.FullName,
                    picture: project.CreatedBySenior.PictureProfile || "https://via.placeholder.com/150", // صورة السينيور
                    role: req.user.Role || "No role provided", // الدور
                } : null,
            }))
        });
    } catch (error) {
        console.error("Error retrieving projects by senior:", error.message);
        return res.status(500).json({
            message: "Error retrieving projects",
            error: error.message,
        });
    }
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
  CreatedBySenior,
    });

    
    if (!deletedProject) {
        return res.status(404).json({ message: "Project not found or you are not authorized to delete this project." });
    }

    return res.status(200).json({ message: "Project deleted successfully." });
};

 // View other people's Project in all fileds

 export const GetProjectsByField = async (req, res) => {
    try {
        const { FieldId } = req.params;

        if (!FieldId) {
            return res.status(400).json({ message: "Field ID is required." });
        }

        console.log("FieldId received:", FieldId);

        const projects = await ProjectsModel.find({ "Fields.id": FieldId })
            .populate("CreatedBySenior", "FullName PictureProfile Email PhoneNumber");

        console.log("Projects found:", projects);

        if (!projects || projects.length === 0) {
            return res.status(200).json({ message: "No projects found for the given Field ID." });
        }

        return res.status(200).json({
            message: "Projects retrieved successfully",
            projects: { 
                filteredProjects: projects.map(project => ({
                    ...project.toObject(),
                    senior: project.CreatedBySenior ? {
                        name: project.CreatedBySenior.FullName,
                        picture: project.CreatedBySenior.PictureProfile?.secure_url || "https://via.placeholder.com/150",
                        email: project.CreatedBySenior.Email || "No email provided",
                        phone: project.CreatedBySenior.PhoneNumber || "No phone number provided",
                    } : null,
                })),
            },
        });
    } catch (error) {
        console.error("Error retrieving projects by FieldId:", error.message);
        return res.status(500).json({
            message: "Error retrieving projects",
            error: error.message,
        });
    }
};

export const GetProjectsByFieldAndSkills = async (req, res) => { 
    try {
        console.log(req.user);
        const userId = req.user._id;
        const userRole = req.user.Role; // يجب التأكد أن المستخدم يحتوي على الحقل role

        // الحصول على بيانات المستخدم
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // استخراج الفيلد والمعارات
        const fieldIds = user.Fields.map(field => field.id);
        const userSkillsWithRate = user.Skills.map(skill => ({
            id: skill.id,
            rate: parseInt(skill.Rate) // تحويل الريت إلى عدد صحيح
        }));

        // التحقق من وجود الفيلد والمعارات
        if (!fieldIds.length && !userSkillsWithRate.length) {
            return res.status(400).json({ message: "User has no field or skills." });
        }

        // البحث عن المشاريع المطابقة بناءً على الفيلد والمعارات
        const projects = await ProjectsModel.find({
            $or: [
                { "Fields.id": { $in: fieldIds } },  // التحقق من الفيلد
                { "RequiredSkills.id": { $in: userSkillsWithRate.map(skill => skill.id) } }  // التحقق من المعارات
            ]
        }).populate("CreatedBySenior", "FullName PictureProfile Email PhoneNumber"); // إضافة populate لجلب بيانات السينيور

        if (!projects || projects.length === 0) {
            return res.status(404).json({ message: "No projects found for the user's fields and skills." });
        }

        // تصفية المشاريع بناءً على الريت
        const filteredProjects = projects.filter(project => {
            return project.RequiredSkills.some(requiredSkill => {
                const requiredRate = parseInt(requiredSkill.Rate); // تحويل الريت إلى عدد صحيح
                const userSkill = userSkillsWithRate.find(skill => skill.id === requiredSkill.id); // العثور على المهارة المطابقة
                return userSkill && userSkill.rate >= requiredRate; // تحقق من الريت
            });
        });

        // تصفية المشاريع التي تتطابق بها المعارات (حتى لو لم تطابق الريت)
        const matchingSkillProjects = projects.filter(project => {
            return project.RequiredSkills.some(requiredSkill => {
                return userSkillsWithRate.some(userSkill => userSkill.id === requiredSkill.id);
            });
        });

        // إذا لم يتم العثور على مشاريع
        if (!filteredProjects.length && !matchingSkillProjects.length) {
            return res.status(404).json({ message: "No projects found matching user's fields and skills." });
        }

        // إعادة النتيجة مع تفاصيل السينيور
        return res.status(200).json({
            message: "Projects retrieved successfully",
            projects: {
                filteredProjects: filteredProjects.map(project => ({
                    ...project.toObject(), // تحويل المشروع إلى كائن عادي لتعديل القيم
                    senior: project.CreatedBySenior ? {
                        name: project.CreatedBySenior.FullName,
                        picture: project.CreatedBySenior.PictureProfile || "https://via.placeholder.com/150", // صورة السينيور
                        email: project.CreatedBySenior.Email || "No email provided",  // الإيميل
                        phone: project.CreatedBySenior.PhoneNumber || "No phone number provided", // رقم الهاتف
                        role: userRole,
                    } : null,
                }
            ))
            },
            userSkillsAndFields: {
                skills: userSkillsWithRate,
                fields: user.Fields,
            }
        });
    } catch (error) {
        console.error("Error retrieving projects by FieldId and skills:", error.message);
        return res.status(500).json({
            message: "Error retrieving projects",
            error: error.message,
        });
    }
};



export const GetProjectsByFilters = async (req, res) => {
    try {
        const { projectName, priceRange, seniorName, requiredSkills, benefits, status, FieldId } = req.query;
        
        // تسجيل الفلاتر للتحقق منها
        console.log("Filters received:", { projectName, priceRange, seniorName, requiredSkills, benefits, status, FieldId });

        // إعداد كائن الفلترة
        let filter = {};

        // فلترة حسب اسم المشروع
        if (projectName) {
            filter.ProjectName = { $regex: projectName, $options: "i" }; // البحث باستخدام النص الجزئي (غير حساس لحالة الأحرف)
        }

        // فلترة حسب السعر (نطاق السعر)
        if (priceRange) {
            const [minPrice, maxPrice] = priceRange.split("-").map(price => parseFloat(price.trim())); // تحويل النص إلى أرقام
            filter.Price = { $gte: minPrice, $lte: maxPrice }; // البحث ضمن نطاق السعر
        }

        // فلترة حسب اسم السينيور
        if (seniorName) {
            const seniors = await UserModel.find({
                FullName: { $regex: seniorName, $options: "i" }, // البحث باستخدام النص الجزئي
            }).select("_id");
            filter.CreatedBySenior = { $in: seniors.map(senior => senior._id) };
        }

        // فلترة حسب المهارات المطلوبة
        if (requiredSkills) {
            const skillsArray = requiredSkills.split(",").map(skill => skill.trim());
            filter["RequiredSkills.name"] = { $in: skillsArray }; // التحقق من وجود المهارات ضمن القائمة
        }

        // فلترة حسب الفوائد
        if (benefits) {
            filter.Benefits = { $regex: benefits, $options: "i" }; // البحث باستخدام النص الجزئي
        }

        // فلترة حسب الحالة
        if (status) {
            filter.Status = status; // التحقق من مطابقة الحالة
        }

        // فلترة حسب الرقم الميداني (FieldId)
        if (FieldId) {
            filter.Fields = { $elemMatch: { id: FieldId } }; // فلترة بحسب الرقم الميداني في قائمة الحقول
        }

        // البحث عن المشاريع باستخدام الفلاتر
        const projects = await ProjectsModel.find(filter)
            .populate("CreatedBySenior", "FullName PictureProfile Email PhoneNumber");

        // إعداد البيانات للإرجاع
        const filteredProjects = projects.map(project => ({
            ...project.toObject(),
            senior: project.CreatedBySenior ? {
                name: project.CreatedBySenior.FullName,
                picture: project.CreatedBySenior.PictureProfile || "https://via.placeholder.com/150",
                email: project.CreatedBySenior.Email || "No email provided",
                phone: project.CreatedBySenior.PhoneNumber || "No phone number provided",
            } : null,
        }));

        // إرسال النتيجة
        return res.status(200).json({
            message: "Projects retrieved successfully",
            projects: { filteredProjects },
        });
    } catch (error) {
        console.error("Error retrieving projects with filters:", error.message);
        return res.status(500).json({
            message: "Error retrieving projects",
            error: error.message,
        });
    }
};


export const GetProjectsProgressCompleteBySenior = async (req, res) => {
    const CreatedBySenior = req.user._id; // ID الخاص بالسينيور

    try {
        // البحث عن المشاريع الخاصة بالسينيور والتي حالتها In Progress أو Completed
        const projects = await ProjectsModel.find({
            CreatedBySenior,
            Status: { $in: ["In Progress", "Completed"] },
        })
            .sort({ created_at: -1 }) // ترتيب المشاريع من الأحدث إلى الأقدم
            .populate("CreatedBySenior", "FullName PictureProfile role"); // إحضار تفاصيل السينيور

        if (!projects.length) {
            return res.status(404).json({ message: "No projects found for this senior." });
        }

        return res.status(200).json({
            message: "Projects retrieved successfully",
            projects,
        });
    } catch (error) {
        console.error("Error retrieving projects by senior:", error.message);
        return res.status(500).json({
            message: "Error retrieving projects",
            error: error.message,
        });
    }
};


export const GetProjectsByUserRole = async (req, res) => {
    const loggedInUserId = req.user._id; // معرف المستخدم المسجل دخول

    try {
        // البحث عن المشاريع التي تحتوي على المستخدم المسجل دخوله في أدوارها
        const projects = await ProjectsModel.find({
            "Roles.users.userId": loggedInUserId, // المستخدم مشارك في الأدوار
            Status: { $in: ["Open", "In Progress", "Completed"] }, // حالة المشروع الآن تشمل "Pending"
        })
            .sort({ created_at: -1 }) // ترتيب المشاريع حسب الأحدث
            .populate("Roles.users.userId", "FullName PictureProfile role"); // جلب بيانات المستخدم

        if (!projects.length) {
            return res.status(404).json({ message: "No projects found for the logged-in user." });
        }

        // إعادة المشاريع مع تفاصيل المستخدم
        return res.status(200).json({
            message: "Projects retrieved successfully",
            projects: projects.map(project => ({
                ...project.toObject(), // تحويل المشروع إلى كائن عادي
                roles: project.Roles.map(role => ({
                    roleName: role.roleName,
                    users: role.users
                        .filter(user => String(user.userId._id) === String(loggedInUserId)) // فقط المستخدم المسجل دخول
                        .map(user => ({
                            name: user.userId.FullName,
                            picture: user.userId.PictureProfile || "https://via.placeholder.com/150", // صورة المستخدم
                            role: user.userId.role,
                            status: user.status, // حالة المستخدم في هذا الدور
                        })),
                })),
            })),
        });
    } catch (error) {
        console.error("Error retrieving projects by user role:", error.message);
        return res.status(500).json({
            message: "Error retrieving projects",
            error: error.message,
        });
    }
};


export const UpdateProjectStatusToInProgress = async (req, res) => {
    const { projectId } = req.params; // معرف المشروع من بارامتر الطلب

    try {
        // تحديث حالة المشروع إلى "In Progress"
        const updatedProject = await ProjectsModel.findByIdAndUpdate(
            projectId,
            { Status: "In Progress" },
            { new: true } // إعادة المشروع المحدث
        );

        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found." });
        }

        return res.status(200).json({
            message: "Project status updated to 'In Progress'.",
            project: updatedProject,
        });
    } catch (error) {
        console.error("Error updating project status to 'In Progress':", error.message);
        return res.status(500).json({
            message: "Error updating project status.",
            error: error.message,
        });
    }
};


export const UpdateProjectStatusToCompleted = async (req, res) => {
    const { projectId } = req.params; // معرف المشروع من بارامتر الطلب

    try {
        // تحديث حالة المشروع إلى "Completed"
        const updatedProject = await ProjectsModel.findByIdAndUpdate(
            projectId,
            { Status: "Completed" },
            { new: true } // إعادة المشروع المحدث
        );

        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found." });
        }

        return res.status(200).json({
            message: "Project status updated to 'Completed'.",
            project: updatedProject,
        });
    } catch (error) {
        console.error("Error updating project status to 'Completed':", error.message);
        return res.status(500).json({
            message: "Error updating project status.",
            error: error.message,
        });
    }
};
