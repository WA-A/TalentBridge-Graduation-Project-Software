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
            DeliveryTaskMethod,
        } = req.body;

        if (!ProjectId || !PhaseName || !TaskName || !Description || !AssignedTo || !TaskRoleName || !TaskStatus || !Priority || !StartDate || !EndDate  || !DeliveryTaskMethod || !BenefitFromPhase) {
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
            DeliveryTaskMethod,
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
                DeliveryTaskMethod: task.DeliveryTaskMethod,
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
