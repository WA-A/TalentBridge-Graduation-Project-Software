import RequestSeniorToAdminModel from '../../Model/RequestSeniorToAdminModel.js';
import UserModel from '../../Model/User.Model.js'; 
import { SendEmail } from "../../../utls/SendEmail.js";

// Get All Request Senior To Admin

export const GetAllRequestSeniorToAdmin = async (req, res) => {
    try {
        const requestseniortoadmin = await RequestSeniorToAdminModel.find();

        return res.status(200).json({
            message: 'All Request Senior To Admin',
            requestseniortoadmin,
        });
    } catch (error) {
        console.error("Error getting all requestseniortoadmin:", error.message);
        return res.status(500).json({
            message: 'Error getting all requestseniortoadmin',
            error: error.message,
        });
    }
}


// Admin Accept of Senior Request
export const AdminAcceptofSeniorRequest = async (req, res) => {
    try {
        const { UserId } = req.params;

        const user = await UserModel.findByIdAndUpdate(
            UserId,
            { SeniorAccountStatus: 'Active' },
            { new: true } 
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await SendEmail(
            user.Email, 
            `Hello ${user.FullName},
            I hope you are well.
            Your request has been approved by the Talent Bridge admin to become eligible to be a senior.
            You can now log in to your account through the login page.`
        );

        res.status(200).json({ message: 'Senior account approved and email sent successfully',
            user: user});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing the request' });
    }
};

 
 
