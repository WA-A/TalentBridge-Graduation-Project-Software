import RequestSeniorToAdminModel from '../../Model/RequestSeniorToAdminModel.js';
import UserModel from '../../Model/User.Model.js'; 
import { SendEmail } from "../../../utls/SendEmail.js";
import { Fields } from '../../../ExternalApiFields/ExternealApiFields.controller.js';
import Skills from '../../../ExternalApiSkills/ExternealApiSkills.controller.js';

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

 
// Add New Fields 

  export const AddNewFields = async (req, res) => {
    try {
      const { sub_specialization, code } = req.body;
  
      if (!sub_specialization || !code) {
        return res.status(400).json({ error: "All fields are required except ID!" });
      }
  
      const newId = Fields.length > 0 
        ? Fields[Fields.length - 1].id + 1 
        : 1;
  
      const newField = {
        id: newId,
        sub_specialization,
        code,
      };
  
      Fields.push(newField);
  
      res.status(201).json({ message: "New field added successfully!", newField });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


  // Add New Skills 

  export const AddNewSkills = async (req, res) => {
    try {
      const { name, code } = req.body;
  
      if (!name || !code) {
        return res.status(400).json({ error: "All Skills are required except ID!" });
      }
  
      const newId = Skills.length > 0 
        ? Skills[Skills.length - 1].id + 1 
        : 1;
  
      const newSkill = {
        id: newId,
        name,
        code,
      };
  
      Skills.push(newSkill);
  
      res.status(201).json({ message: "New skills added successfully!", newSkill });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  


  
