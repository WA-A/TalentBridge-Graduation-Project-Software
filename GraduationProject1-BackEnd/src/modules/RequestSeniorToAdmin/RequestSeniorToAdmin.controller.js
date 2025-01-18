import cloudinary from '../../../utls/Cloudinary.js';
import RequestSeniorToAdminModel from '../../Model/RequestSeniorToAdminModel.js';



export const CreateRequestSeniorToAdmin = async (req, res) => {
    try {
        const {
            PreviousExperiences,
            Motivation,
            Contribution,
            Major,
        } = req.body;


        const Certifications = req.files?.['Certifications']
            ? await Promise.all(
                  req.files['Certifications'].map(async (file) => {
                      const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                          folder: `GraduationProject1-Software/RequestSeniorToAdmin/Certifications`,
                      });

                      return {
                          secure_url,
                          public_id,
                          originalname: file.originalname,
                      };
                  })
              )
            : [];

        const requestseniortoadmin = await RequestSeniorToAdminModel.create({
            PreviousExperiences,
            Motivation,
            Contribution,
            Major,
            Certifications,
        });

        return res.status(201).json({
            message: 'request created successfully',
            requestseniortoadmin,
        });
    } catch (error) {
        console.error("Error creating request:", error.message);
        return res.status(500).json({
            message: 'Error creating request',
            error: error.message,
        });
    }
};


  



 
 
