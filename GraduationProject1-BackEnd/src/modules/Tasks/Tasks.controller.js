import ProjectsModel from "../../Model/ProjectsModel.js";
import cloudinary from '../../../utls/Cloudinary.js';
import  UserModel from "../../Model/User.Model.js";

import mongoose from "mongoose";
export const GetProjectTasks = async (req, res) => {
    try {
      const { ProjectId } = req.params; // الحصول على ProjectId من الطلب
      const UserId = req.user._id; // استخراج UserId من التوكن
  
      // التحقق من وجود ProjectId
      if (!ProjectId) {
        return res.status(400).json({ message: "Project ID is required" });
      }
  
      // البحث عن المشروع
      const project = await ProjectsModel.findById(ProjectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      // تصفية المهام المرتبطة بـ UserId فقط
      const filteredTasks = project.Tasks.filter((task) =>
        task.AssignedTo.some((assignedUserId) => assignedUserId.toString() === UserId.toString())
      );
  
      // إذا لم تكن هناك مهام مرتبطة
      if (filteredTasks.length === 0) {
        return res.status(404).json({ message: "No tasks found assigned to you in this project" });
      }
  
      // تجهيز المهام بالشكل المطلوب مع جميع الحقول
      const tasks = filteredTasks.map((task) => ({
        ...task._doc, // جميع الحقول الموجودة في المهمة
        AssignedTo: task.AssignedTo.map((assignedUserId) => assignedUserId.toString()), // تحويل AssignedTo إلى نصوص
      }));
  
      return res.status(200).json({
        message: "Tasks retrieved successfully",
        tasks,
      });
    } catch (error) {
      console.error("Error retrieving project tasks:", error.message);
      return res.status(500).json({
        message: "Error retrieving project tasks",
        error: error.message,
      });
    }
  };
  
  
export const CreateTask = async (req, res) => {
    try {
        const {
            ProjectId,  
            PhaseName,
            TaskName,
            Description,
            AssignedTo,
            TaskRoleName,
            TaskStatus,
            Priority,
            StartDate,
            EndDate,
            BenefitFromPhase,
            SubmitTaskMethod,
        } = req.body;

        if (!ProjectId || !PhaseName || !TaskName || !Description || !AssignedTo || !TaskRoleName || !TaskStatus || !Priority || !StartDate || !EndDate  || !SubmitTaskMethod || !BenefitFromPhase) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (new Date(StartDate) > new Date(EndDate)) {
            return res.status(400).json({ message: "Start date cannot be later than end date" });
        }
          
        const project = await ProjectsModel.findById(ProjectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const TaskFile = req.files?.['TaskFile']
                    ? await Promise.all(
                          req.files['TaskFile'].map(async (file) => {
                              const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                                  folder: `GraduationProject1-Software/Project/Task/TaskFile/${ProjectId}`,
                              });
        
                              return {
                                  secure_url,
                                  public_id,
                                  originalname: file.originalname,
                              };
                          })
                      )
                    : [];

                   

        const newTask = {
            PhaseName,
            TaskName,
            Description,
            AssignedTo,
            TaskRoleName,
            TaskStatus,
            Priority,
            StartDate,
            EndDate,
            TaskFile,  
            SubmitTaskMethod,
            BenefitFromPhase,
        };

        project.Tasks.push(newTask);
        await project.save();

        return res.status(201).json({
            message: 'Task created successfully',
            task: newTask,
        });
    } catch (error) {
        console.error("Error creating task:", error.message);
        return res.status(500).json({
            message: 'Error creating task',
            error: error.message,
        });
    }
};


// Get All Tasks By Senior in Project 

export const GetAllTasksBySenior = async (req, res) => {
    try {
        const { ProjectId } = req.params;

        if (!ProjectId) {
            return res.status(400).json({ message: "ProjectId is required" });
        }

        const project = await ProjectsModel.findById(ProjectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const tasks = project.Tasks || [];

        return res.status(200).json({
            message: "Tasks fetched successfully",
            tasks: tasks
        });
    } catch (error) {
        console.error("Error fetching tasks:", error.message);
        return res.status(500).json({
            message: "Error fetching tasks",
            error: error.message,
        });
    }
};


export const updateTaskDatesAndStatus = async (req, res) => {
    try {
        const { ProjectId } = req.params;
        const { TaskId, StartDate, EndDate } = req.body;
        console.log(ProjectId,TaskId,StartDate,EndDate);
        if (!ProjectId || !TaskId || !StartDate || !EndDate) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (new Date(StartDate) > new Date(EndDate)) {
            return res.status(400).json({ message: "Start date cannot be later than end date" });
        }

        const project = await ProjectsModel.findById(ProjectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const task = project.Tasks.find((t) => t._id.toString() === TaskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // تحديث التواريخ وحالة المهمة
        task.StartDate = StartDate;
        task.EndDate = EndDate;
        task.TaskStatus = "In Progress"; // تغيير الحالة إلى "قيد التقدم"

        await project.save();

        return res.status(200).json({
            message: "Task dates and status updated successfully",
            task: {
                TaskId: task._id,
                StartDate: task.StartDate,
                EndDate: task.EndDate,
                TaskStatus: task.TaskStatus,
            },
        });
    } catch (error) {
        console.error("Error updating task dates and status:", error.message);
        return res.status(500).json({
            message: "Error updating task dates and status",
            error: error.message,
        });
    }
};



export const addTaskAssigneesAndFile = async (req, res) => {
    try {
        const { ProjectId } = req.params;
        const { TaskId, AssignedTo, SubmitTaskMethod } = req.body;

        if (!ProjectId || !TaskId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const project = await ProjectsModel.findById(ProjectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const task = project.Tasks.find((t) => t._id.toString() === TaskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // سجل الوقت لمعرفة أداء العملية
        console.time("TaskProcessing");
        console.time("FileUpload");

        // معالجة الملفات المرفوعة
        const TaskFile = req.files?.['TaskFile']
            ? await Promise.all(
                  req.files['TaskFile'].map(async (file) => {
                      // التحقق من حجم الملف قبل رفعه
                      if (file.size > 0) {
                          const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                              folder: `GraduationProject1-Software/Project/Task/TaskFile/${ProjectId}`,
                          });

                          return {
                              secure_url,
                              public_id,
                              originalname: file.originalname,
                          };
                      }
                      return null;
                  })
              ).then((files) => files.filter((file) => file !== null)) // استبعاد الملفات الفارغة
            : [];

        // إضافة TaskFile إلى المهمة
        if (TaskFile.length > 0) {
            task.TaskFile = TaskFile;
        }
        console.timeEnd("FileUpload");

        // تحديث الأشخاص المعيّنين
        if (AssignedTo) {
            const assignedIds = Array.isArray(AssignedTo) ? AssignedTo : [AssignedTo];
            task.AssignedTo = assignedIds.map((id) => new mongoose.Types.ObjectId(id));
        }

        // تحديث طريقة تسليم المهمة
        if (SubmitTaskMethod) {
            task.SubmitTaskMethod = SubmitTaskMethod;
        }

        await project.save();
        console.timeEnd("TaskProcessing");

        return res.status(200).json({
            message: "Task assignees and file added successfully",
            task: {
                TaskId: task._id,
                AssignedTo: task.AssignedTo,
                TaskFile,
                SubmitTaskMethod: task.SubmitTaskMethod,
            },
        });
    } catch (error) {
        console.error("Error adding task assignees and file:", error.message);
        return res.status(500).json({
            message: "Error adding task assignees and file",
            error: error.message,
        });
    }
};


// Get All Tasks For Junior

export const GetAllTasksForJunior = async (req, res) => {
    try {
        const { UserId } = req.params;

        if (!UserId) {
            return res.status(400).json({ message: "UserId is required" });
        }

        const projects = await ProjectsModel.find({
            "Tasks.AssignedTo": UserId,
        });

        if (!projects || projects.length === 0) {
            return res.status(404).json({ message: "No tasks found for this user" });
        }

        const tasks = projects.flatMap((project) =>
            project.Tasks.filter((task) => task.AssignedTo?.toString() === UserId)
        );

        return res.status(200).json({
            message: "Tasks fetched successfully",
            tasks: tasks.map(task => ({
                TaskName: task.TaskName,
                PhaseName: task.PhaseName,
                Description: task.Description,
                TaskStatus: task.TaskStatus,
                Priority: task.Priority,
                StartDate: task.StartDate,
                EndDate: task.EndDate,
                TaskFile: task.TaskFile,
                SubmitTaskMethod: task.SubmitTaskMethod,
                BenefitFromPhase: task.BenefitFromPhase,
            })),
        });
    } catch (error) {
        console.error("Error fetching tasks for user:", error.message);
        return res.status(500).json({
            message: "Error fetching tasks for user",
            error: error.message,
        });
    }
};


// Delete Task From Project By Senior 

export const DeleteTask = async (req, res) => {
    try {
        const { ProjectId } = req.params; 
        const { TaskId } = req.body; 

        if (!ProjectId || !TaskId) {
            return res.status(400).json({ message: "ProjectId and TaskId are required" });
        }

        const project = await ProjectsModel.findById(ProjectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const taskIndex = project.Tasks.findIndex((task) => task._id.toString() === TaskId);

        if (taskIndex === -1) {
            return res.status(404).json({ message: "Task not found in the specified project" });
        }

        project.Tasks.splice(taskIndex, 1);

        await project.save();

        return res.status(200).json({
            message: "Task deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting task from project:", error.message);
        return res.status(500).json({
            message: "Error deleting task",
            error: error.message,
        });
    }
};



//  Submit Task By Junior

export const SubmitTask = async (req, res) => {
    try {
        const { ProjectId } = req.params;
        const UserId = req.user._id;
        const { TaskId } = req.body;

        if (!ProjectId || !TaskId || !UserId ) {
            return res.status(400).json({ message: "All fields are required" });
        }


        const SubmitFile = req.files?.['SubmitFile']
                    ? await Promise.all(
                          req.files['SubmitFile'].map(async (file) => {
                              const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                                  folder: `GraduationProject1-Software/Project/Task/Submit/SubmitFile/${TaskId}`,
                                  resource_type: "raw" // zip files

                              });
        
                              return {
                                  secure_url,
                                  public_id,
                                  originalname: file.originalname,
                              };
                          })
                      )
                    : [];

        const project = await ProjectsModel.findById(ProjectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const task = project.Tasks.find((t) => t._id.toString() === TaskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const submission = {
            UserId,
            SubmitFile
        };

        task.Submissions.push(submission);
        await project.save();

        res.status(200).json({ message: "Task submitted successfully", submission });
    } catch (error) {
        console.error("Error submitting task:", error.message);
        res.status(500).json({ message: "Error submitting task", error: error.message });
    }
};


// Update Submit Task By Junior Before End Date
export const UpdateSubmitTask = async (req, res) => {
    try {
        const { ProjectId  } = req.params; 
        const UserId = req.user._id;
        const { TaskId } = req.body; 

        if (!ProjectId || !TaskId || !UserId) {
            return res.status(400).json({ message: "Project ID, Task ID, and User ID are required" });
        }

        const SubmitFile = req.files?.['SubmitFile']
            ? await Promise.all(
                  req.files['SubmitFile'].map(async (file) => {
                      const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                          folder: `GraduationProject1-Software/Project/Task/Submit/SubmitFile/${TaskId}`,
                          resource_type: "raw" // zip files
                      });
                      return {
                          secure_url,
                          public_id,
                          originalname: file.originalname,
                      };
                  })
              )
            : [];

        const project = await ProjectsModel.findById(ProjectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const task = project.Tasks.find((t) => t._id.toString() === TaskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const currentDate = new Date();
        if (currentDate > new Date(task.EndDate)) {
            return res.status(400).json({ message: "Submission is not allowed after the task's end date" });
        }

        const submission = {
            UserId,
            SubmitFile,
            submittedAt: currentDate,
        };

        task.Submissions = task.Submissions || [];
        task.Submissions.push(submission);

        await project.save();

        res.status(200).json({ message: "Task submitted successfully", submission });
    } catch (error) {
        console.error("Error submitting task:", error.message);
        res.status(500).json({ message: "Error submitting task", error: error.message });
    }
};



// Get All Submissions Own By Junior

export const GetAllJuniorSubmissions = async (req, res) => {
    try {
        const { ProjectId } = req.params; 
        const UserId = req.user._id; 

        if (!ProjectId) {
            return res.status(400).json({ message: "Project ID is required" });
        }

        const project = await ProjectsModel.findById(ProjectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const tasksWithUserSubmissions = project.Tasks.map((task) => {
            const userSubmissions = (task.Submissions || []).filter(
                (submission) => submission.UserId.toString() === UserId.toString()
            );

            return {
                TaskId: task._id,
                TaskName: task.TaskName,
                Submissions: userSubmissions,
            };
        });

        const hasSubmissions = tasksWithUserSubmissions.some(
            (task) => task.Submissions.length > 0
        );

        if (!hasSubmissions) {
            return res.status(404).json({ message: "No submissions found for this user in the project" });
        }

        return res.status(200).json({
            message: "Submissions retrieved successfully",
            tasks: tasksWithUserSubmissions,
        });
    } catch (error) {
        console.error("Error retrieving submissions for user:", error.message);
        return res.status(500).json({
            message: "Error retrieving submissions for user",
            error: error.message,
        });
    }
};



// Get All Submissions For Task By Senior

export const GetTaskSubmissionsBySenior = async (req, res) => {
    try {
        const { ProjectId } = req.params;
        const { TaskId } = req.query; // استخراج TaskId من الـ query parameters

        if (!ProjectId || !TaskId) {
            return res.status(400).json({ message: "ProjectId and TaskId are required" });
        }

        const project = await ProjectsModel.findById(ProjectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const task = project.Tasks.find((task) => task._id.toString() === TaskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found in this project" });
        }

        const submissions = task.Submissions || [];
        if (submissions.length === 0) {
            return res.status(404).json({ message: "No submissions found for this task" });
        }

        // إحضار بيانات المستخدمين المرتبطة بـ UserId لكل تسليم
        const submissionsWithUserDetails = await Promise.all(
            submissions.map(async (submission) => {
                const user = await UserModel.findById(submission.UserId); // افتراض وجود موديل المستخدم
                return {
                    ...submission.toObject(),
                    UserFullName: user ? user.FullName : "User not found", // إرجاع اسم المستخدم أو رسالة عند عدم وجوده
                };
            })
        );

        return res.status(200).json({
            message: "Submissions retrieved successfully",
            task: {
                TaskId: task._id,
                TaskName: task.TaskName,
                Submissions: submissionsWithUserDetails,
            },
        });
    } catch (error) {
        console.error("Error retrieving task submissions:", error.message);
        return res.status(500).json({
            message: "Error retrieving task submissions",
            error: error.message,
        });
    }
};


export const CompleteTask = async (req, res) => {
    try {
        const { ProjectId } = req.params; // استخراج ProjectId من الـ params
        const { TaskId } = req.query; // استخراج TaskId من الـ query parameters

        // تحقق من إدخال القيم
        if (!ProjectId || !TaskId) {
            return res.status(400).json({ message: "ProjectId and TaskId are required" });
        }

        // البحث عن المشروع
        const project = await ProjectsModel.findById(ProjectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // البحث عن المهمة داخل المشروع
        const taskIndex = project.Tasks.findIndex((task) => task._id.toString() === TaskId);

        if (taskIndex === -1) {
            return res.status(404).json({ message: "Task not found in this project" });
        }

        // تحديث حالة المهمة إلى "Completed"
        project.Tasks[taskIndex].TaskStatus = "Completed";
        await project.save();

        return res.status(200).json({
            message: "Task completed successfully",
            task: {
                TaskId: project.Tasks[taskIndex]._id,
                TaskName: project.Tasks[taskIndex].TaskName,
                TaskStatus: project.Tasks[taskIndex].TaskStatus,
            },
        });
    } catch (error) {
        console.error("Error completing task:", error.message);
        return res.status(500).json({
            message: "Error completing task",
            error: error.message,
        });
    }
};

// Create Revivew For Task By Senior

export const AddReviewToSubmission = async (req, res) => {
    try {
        const { ProjectId } = req.params;
        const {TaskId, SubmissionId,TaskRating, Feedback } = req.body;
        

        if (!ProjectId || !TaskId || !SubmissionId) {
            return res.status(400).json({ message: "Project ID, Task ID, and Submission ID are required" });
        }

        if (!TaskRating || TaskRating < 0 || TaskRating > 100) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        const project = await ProjectsModel.findById(ProjectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.CreatedBySenior.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only the senior responsible for this project can add reviews" });
        }

        const task = project.Tasks.find((task) => task._id.toString() === TaskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const submission = task.Submissions.find((submission) => submission._id.toString() === SubmissionId);
        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        submission.Review = {
            TaskRating,
            Feedback,
        };

        await project.save();

        return res.status(200).json({
            message: "Review added successfully",
            submission,
        });
    } catch (error) {
        console.error("Error adding review to submission:", error.message);
        return res.status(500).json({
            message: "Error adding review to submission",
            error: error.message,
        });
    }
};


export const GetReviewForTaskSubmission = async (req, res) => {
    try {
      // استخراج معرّف المشروع و معرّف المهمة و معرّف الإرسال من الـ request
      const { ProjectId, TaskId, SubmissionId } = req.params;
      const UserId = req.user._id;  // معرّف المستخدم المستخرج من التوكن
  
      if (!ProjectId || !TaskId || !SubmissionId) {
        return res.status(400).json({ message: "ProjectId, TaskId, and SubmissionId are required" });
      }
  
      // البحث عن المشروع باستخدام ProjectId
      const project = await ProjectsModel.findById(ProjectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      // العثور على المهمة ضمن المشروع باستخدام TaskId
      const task = project.Tasks.find(task => task._id.toString() === TaskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      // العثور على الإرسال باستخدام SubmissionId
      const submission = task.Submissions.find(submission => submission._id.toString() === SubmissionId);
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }
  
      // مقارنة معرّف المستخدم (UserId) مع معرّف المستخدم في الإرسال
      if (submission.UserId.toString() !== UserId.toString()) {
        return res.status(403).json({ message: "User is not authorized to view this review" });
      }
  
      // التحقق من وجود المراجعة في الـ Submission
      if (!submission.Review) {
        return res.status(404).json({ message: "No review found for this submission" });
      }
  
      // إرجاع المراجعة
      return res.status(200).json({
        message: "Review found successfully",
        review: submission.Review,
      });
    } catch (error) {
      console.error("Error retrieving review for task submission:", error.message);
      return res.status(500).json({
        message: "Error retrieving review for task submission",
        error: error.message,
      });
    }
  };
  
// Review Skills By Senior

export const ReviewSkills = async (req, res) => {
    try {
        const { ProjectId } = req.params;
        const seniorUserId = req.user._id;
        const { SkillsRatings, JuniorUserId } = req.body;

        if (!ProjectId || !SkillsRatings || !Array.isArray(SkillsRatings) || !JuniorUserId) {
            return res.status(400).json({ message: "Project ID, Junior User ID, and an array of skill ratings are required" });
        }

        const project = await ProjectsModel.findById(ProjectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        const junior = await UserModel.findById(JuniorUserId);
        if (!junior) return res.status(404).json({ message: "Junior user not found" });

        const requiredSkillIds = project.RequiredSkills.map(skill => skill.id.toString());
        const reviewsToAdd = [];

        for (const rating of SkillsRatings) {
            const { SkillId, SkillName, NewRatingSkill } = rating;

            if (!SkillId || !SkillName || !NewRatingSkill) {
                return res.status(400).json({ message: "Each skill rating must include SkillId, SkillName, and NewRatingSkill" });
            }

            if (!requiredSkillIds.includes(SkillId.toString())) {
                return res.status(400).json({ message: `Skill with ID ${SkillId} does not exist in the project's required skills` });
            }

            if (NewRatingSkill < 1 || NewRatingSkill > 5) {
                return res.status(400).json({ message: `Rating for Skill ${SkillId} must be between 1 and 5` });
            }

            const existingReview = project.SkillReviews.find(review =>
                review.UserId.toString() === JuniorUserId.toString() &&
                review.SkillId.toString() === SkillId.toString()
            );

            if (existingReview && NewRatingSkill < existingReview.NewRatingSkill) {
                return res.status(400).json({
                    message: `New rating for Skill ${SkillId} cannot be less than the previous rating`,
                });
            }

            reviewsToAdd.push({
                SkillId,
                skillName: SkillName, // استخدام اسم المهارة القادم من اليوزر
                UserId: JuniorUserId,
                NewRatingSkill,
            });
        }

        if (!project.SkillReviews) project.SkillReviews = [];
        project.SkillReviews.push(...reviewsToAdd);
        await project.save();

        res.status(200).json({ message: "Skills reviewed successfully", reviews: reviewsToAdd });

    } catch (error) {
        console.error("Error reviewing skills:", error.message);
        res.status(500).json({ message: "Error reviewing skills", error: error.message });
    }
};
