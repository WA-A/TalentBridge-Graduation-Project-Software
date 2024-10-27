import UserModel from "../../Model/User.Model.js";
import Cloudinary from '../../../utls/Cloudinary.js';

// Create Own Profile
export const createProfile = async (req, res) => {
   const { About, Bio } = req.body;
   const authuser = req.user;

   const existingUser = await UserModel.findById(authuser._id)

    if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
    }

   
   
    const {secure_url,public_id} = await Cloudinary.uploader.upload(req.file.path,
    {
        folder:'GraduationProject1-Software/Proflie/id'
    });
    
    existingUser.PictureProfile = { secure_url, public_id }; 

    
    const user =  await UserModel.create(req.body);
    return res.status(200).json({message:user});

   
}

//  View Own Profile
export const ViewOwnProfile = async (req, res) => {  
    try {
       const user = await UserModel.findById(req.user.id);
       if (!user) return res.status(404).json({ message: "User not found" });
 
       res.status(200).json(user);
    } catch (error) {
       res.status(500).json({ message: error.message });
    }
 };
 
 
 
 
