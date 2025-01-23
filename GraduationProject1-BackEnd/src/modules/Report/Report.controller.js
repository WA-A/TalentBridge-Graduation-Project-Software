import ProjectsModel from "../../Model/ProjectsModel.js";

// Create Report For Submission

export const CreateReport = async (req, res) => {
    try {
      const { ProjectId } = req.params;
      const { TaskId, BenefitSummary, ChallengesFaced } = req.body;
      const UserId = req.user._id; 
  
      if (!BenefitSummary || !ChallengesFaced) {
        return res.status(400).json({ message: "BenefitSummary and ChallengesFaced are required." });
      }
  
      const project = await ProjectsModel.findById(ProjectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found." });
      }
  
      const task = project.Tasks.id(TaskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found." });
      }
  
      const submission = task.Submissions.find((sub) => sub.UserId.toString() === UserId.toString());
      if (!submission) {
        return res.status(404).json({ message: "Submission for this user not found." });
      }
  
      submission.Report = {
        BenefitSummary: BenefitSummary,
        ChallengesFaced: ChallengesFaced || "",
        AddedAt: new Date(),
      };
  
      await project.save();
  
      res.status(200).json({ message: "Report added successfully.", task });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred.", error: error.message });
    }
  };
  
  
  

