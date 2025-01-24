import RequestSeniorToAdminModel from '../../Model/RequestSeniorToAdminModel.js';


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


 
 
