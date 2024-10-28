import ProjectsModel from "../../Model/ProjectsModel.js";


// Create Project By Senior
export const CreateProject = async(req,res)=>{
    const {ProjectName,Description,RequiredSkills,Field} = req.body;
    const CreatedBySenior = req.user._id;
    

    const project = await ProjectsModel.create({ProjectName,Description,RequiredSkills,Field,CreatedBySenior});
    
    return res.status(200).json({message:project});
}

//  View Own Project Created

 
 // Edit Own Project Created


// Delete Own Project Created


 // View other people's Project in all fileds
 
 
