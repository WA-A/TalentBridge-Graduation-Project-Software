import ProjectsModel from "../../Model/ProjectsModel.js";
import cloudinary from '../../../utls/Cloudinary.js';


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
            tasks: tasks.map(task => ({
                TaskName: task.TaskName,
                PhaseName: task.PhaseName,
                Description: task.Description,
                TaskStatus: task.TaskStatus,
                AssignedTo: task.AssignedTo,
                Priority: task.Priority,
                StartDate: task.StartDate,
                EndDate: task.EndDate,
                TaskFile: task.TaskFile,
                SubmitTaskMethod: task.SubmitTaskMethod,
                BenefitFromPhase: task.BenefitFromPhase,
            })),
        });
    } catch (error) {
        console.error("Error fetching tasks:", error.message);
        return res.status(500).json({
            message: "Error fetching tasks",
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
        const { TaskId } = req.body;    

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

        return res.status(200).json({
            message: "Submissions retrieved successfully",
            task: {
                TaskId: task._id,
                TaskName: task.TaskName,
                Submissions: submissions,
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


// Review Skills By Senior

// ملاحظة ليس جاهز هذا الفنكشن يجب ان يفحص السكلز اذا موجودة عند الجينيور وقيمة الريت تزيد لا تقل واذا السكلز جديدة يضع قيمة مناسبة لتقييم هذه السكلز لدا الجينيور 

export const ReviewSkills = async (req, res) => {    
    try {
        const { ProjectId } = req.params;
        const UserId = req.user._id;
        const { SkillId,  NewRatingSkill } = req.body;

        if (!ProjectId || !SkillId || !UserId || !NewRatingSkill) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (NewRatingSkill < 1 || NewRatingSkill > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        const project = await ProjectsModel.findById(ProjectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const skillExists = project.RequiredSkills.some((skill) => skill.id.toString() === SkillId.toString());
        if (!skillExists) {
            return res.status(400).json({ message: "The skill does not exist in the project's required skills" });
        }

        const review = {
            SkillId,
            UserId,
            NewRatingSkill,
        };

        if (!project.SkillReviews) project.SkillReviews = []; 
        project.SkillReviews.push(review);
        await project.save();

        res.status(200).json({ message: "Skill reviewed successfully", review });
    } catch (error) {
        console.error("Error reviewing skill:", error.message);
        res.status(500).json({ message: "Error reviewing skill", error: error.message });
    }
};



