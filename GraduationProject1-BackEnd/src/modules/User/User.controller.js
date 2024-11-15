import UserModel from "../../Model/User.Model.js";
import Cloudinary from '../../../utls/Cloudinary.js';


// Create Own Profile
export const CreateProfile = async (req, res) => {
    try {
       
        const { About, Bio } = req.body;
        const authuser = req.user;  

        if (!authuser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        
        const { secure_url, public_id } = await Cloudinary.uploader.upload(req.file.path, {
            folder: `GraduationProject1-Software/Profile/${authuser._id}`,
        });

        
        const existingUser = await UserModel.findById(authuser._id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        existingUser.PictureProfile = { secure_url, public_id };
        existingUser.About = About;
        existingUser.Bio = Bio;

        await existingUser.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            user: existingUser,
        });
    } catch (error) {
        console.error("Error in createProfile:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};












