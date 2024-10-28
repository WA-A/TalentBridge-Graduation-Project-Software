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


// Delete Own Project Created


 // View other people's Project in all fileds
 
 
