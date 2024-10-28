import ProjectsModel from "../../Model/ProjectsModel.js";


// Create Project By Senior
export const CreateProject = async(req,res)=>{
    const {ProjectName,Description,RequiredSkills,Field} = req.body;
    const CreatedBySenior = req.user._id;
    

    const project = await ProjectsModel.create({ProjectName,Description,RequiredSkills,Field,CreatedBySenior});
    
    return res.status(200).json({message:project});
}

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
    const { ProjectId } = req.params; 
    const CreatedBySenior = req.user._id; 

  
    const { ProjectName, Description, RequiredSkills } = req.body;

    const updatedProject = await ProjectsModel.findByIdAndUpdate(
        { _id: ProjectId, CreatedBySenior },
        { 
            $set: {
                ProjectName, 
                Description, 
                RequiredSkills 
            } 
        },
        { new: true } 
    );

   
    if (!updatedProject) {
        return res.status(404).json({ message: "Project not found or you are not authorized to modify this project." });
    }

    return res.status(200).json({ message: "Project updated successfully", project: updatedProject });
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
    const { Field } = req.params; 
    const CreatedBySenior = req.user._id; 
    console.log("Field parameter received:", Field);
    
    
    if (!Field) {
        return res.status(400).json({ message: "Field parameter is required." });
    }

    const projects = await ProjectsModel.find({ Field: Field });

    if (projects.length === 0) {
        return res.status(404).json({ message: "No projects found in this field." });
    }

    return res.status(200).json({ message: "Projects retrieved successfully.", projects });
};


 
 
