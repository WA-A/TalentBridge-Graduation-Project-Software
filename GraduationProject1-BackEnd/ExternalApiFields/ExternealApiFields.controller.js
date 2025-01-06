import UserModel from '../src/Model/User.Model.js';

const Fields = [
    // Information Technology & Computer Science (1-100)
    { id: 1, sub_specialization: "Software Engineering", code: "IT_SE_SWE" },
    { id: 2, sub_specialization: "Web Development", code: "IT_SE_WD" },
    { id: 3, sub_specialization: "Mobile Development", code: "IT_SE_MD" },
    { id: 4, sub_specialization: "Cloud Computing", code: "IT_CC_CLD" },
    { id: 5, sub_specialization: "Artificial Intelligence", code: "IT_AI_AIN" },
    { id: 6, sub_specialization: "Machine Learning", code: "IT_AI_ML" },
    { id: 7, sub_specialization: "Deep Learning", code: "IT_AI_DL" },
    { id: 8, sub_specialization: "Computer Vision", code: "IT_AI_CV" },
    { id: 9, sub_specialization: "Natural Language Processing", code: "IT_AI_NLP" },
    { id: 10, sub_specialization: "Data Science", code: "IT_DS_DSC" },
    { id: 11, sub_specialization: "Big Data Analytics", code: "IT_DS_BDA" },
    { id: 12, sub_specialization: "Data Engineering", code: "IT_DS_DE" },
    { id: 13, sub_specialization: "Database Administration", code: "IT_DB_DBA" },
    { id: 14, sub_specialization: "Network Security", code: "IT_SEC_NS" },
    { id: 15, sub_specialization: "Cybersecurity", code: "IT_SEC_CS" },
    { id: 16, sub_specialization: "Information Security", code: "IT_SEC_IS" },
    { id: 17, sub_specialization: "Game Development", code: "IT_GM_GD" },
    { id: 18, sub_specialization: "DevOps Engineering", code: "IT_SE_DO" },
    { id: 19, sub_specialization: "System Administration", code: "IT_SYS_SA" },
    { id: 20, sub_specialization: "Network Engineering", code: "IT_NET_NE" },
    { id: 21, sub_specialization: "Blockchain Development", code: "IT_BC_BD" },
    { id: 22, sub_specialization: "IoT Development", code: "IT_IOT_ID" },
    { id: 23, sub_specialization: "UI/UX Design", code: "IT_UX_UID" },
    { id: 24, sub_specialization: "Quality Assurance", code: "IT_SE_QA" },
    { id: 25, sub_specialization: "Frontend Development", code: "IT_SE_FE" },
    { id: 26, sub_specialization: "Backend Development", code: "IT_SE_BE" },
    { id: 27, sub_specialization: "Full Stack Development", code: "IT_SE_FS" },
    { id: 28, sub_specialization: "Augmented Reality", code: "IT_AR_AR" },
    { id: 29, sub_specialization: "Virtual Reality", code: "IT_VR_VR" },
    { id: 30, sub_specialization: "Robotics", code: "IT_ROB_ROB" },
    { id: 31, sub_specialization: "Quantum Computing", code: "IT_QC_QC" },
    { id: 32, sub_specialization: "Cryptography", code: "IT_SEC_CRYP" },
    { id: 33, sub_specialization: "IT Support", code: "IT_SUP_IT" },
    { id: 34, sub_specialization: "Digital Forensics", code: "IT_SEC_DF" },
    { id: 35, sub_specialization: "Systems Analysis", code: "IT_SYS_SA" },
    { id: 36, sub_specialization: "Hardware Engineering", code: "IT_HW_HE" },
    { id: 37, sub_specialization: "Embedded Systems", code: "IT_EMS_EM" },
    { id: 38, sub_specialization: "IT Management", code: "IT_MGT_ITM" },
    { id: 39, sub_specialization: "Technical Writing", code: "IT_TW_TW" },
    { id: 40, sub_specialization: "IT Consultancy", code: "IT_CON_ITC" },
    { id: 41, sub_specialization: "E-commerce Development", code: "IT_ECOM_ECD" },
    { id: 42, sub_specialization: "IT Training", code: "IT_TRAIN_ITT" },
    { id: 43, sub_specialization: "Bioinformatics", code: "IT_BIO_BIO" },
    { id: 44, sub_specialization: "High-Performance Computing", code: "IT_HPC_HPC" },
    { id: 45, sub_specialization: "IT Policy", code: "IT_POL_ITP" },
    { id: 46, sub_specialization: "Geographic Information Systems", code: "IT_GIS_GIS" },
    { id: 47, sub_specialization: "Scientific Computing", code: "IT_SC_SC" },
    { id: 48, sub_specialization: "IT Operations", code: "IT_OPS_IT" },
    { id: 49, sub_specialization: "IT Risk Management", code: "IT_RISK_RM" },
    { id: 50, sub_specialization: "Multimedia Development", code: "IT_MM_MD" },
    { id: 51, sub_specialization: "IT Sales", code: "IT_SALES_IS" },
    { id: 52, sub_specialization: "Smart Cities", code: "IT_SC_SM" },
    { id: 53, sub_specialization: "Space Technology", code: "IT_ST_SP" },
    { id: 54, sub_specialization: "Wearable Technology", code: "IT_WT_WT" },
    { id: 55, sub_specialization: "Digital Media", code: "IT_DM_DM" },
    { id: 56, sub_specialization: "IT Procurement", code: "IT_PR_ITP" },
    { id: 57, sub_specialization: "Network Programming", code: "IT_NET_NP" },
    { id: 58, sub_specialization: "Server Maintenance", code: "IT_SM_SM" },
    { id: 59, sub_specialization: "IT Research", code: "IT_RES_IR" },
    { id: 60, sub_specialization: "Visual Analytics", code: "IT_VA_VA" },
    { id: 61, sub_specialization: "Software Localization", code: "IT_SL_SLOC" },
    { id: 62, sub_specialization: "Voice Technology", code: "IT_VT_VT" },
    { id: 63, sub_specialization: "Edge Computing", code: "IT_EC_EC" },
    { id: 64, sub_specialization: "Green IT", code: "IT_GREEN_GIT" },
    { id: 65, sub_specialization: "IT Accessibility", code: "IT_ACC_ACC" },
    { id: 66, sub_specialization: "eLearning Development", code: "IT_EL_ELD" },
    { id: 67, sub_specialization: "IT Automation", code: "IT_AUT_AUTO" },
    { id: 68, sub_specialization: "Remote Sensing", code: "IT_RS_RS" },
    { id: 69, sub_specialization: "Social Computing", code: "IT_SC_SCOMP" },
    { id: 70, sub_specialization: "Sensor Networks", code: "IT_SN_SN" },
    { id: 71, sub_specialization: "Enterprise Architecture", code: "IT_EA_EA" },
    { id: 72, sub_specialization: "IT Service Management", code: "IT_SM_SM" },
    { id: 73, sub_specialization: "Mobile UI Design", code: "IT_MUI_MD" },
    { id: 74, sub_specialization: "Software Metrics", code: "IT_SM_SMET" },
    { id: 75, sub_specialization: "Software Process Improvement", code: "IT_SPI_SPI" },
    { id: 76, sub_specialization: "Distributed Computing", code: "IT_DC_DC" },
    { id: 77, sub_specialization: "Systems Integration", code: "IT_SI_SINT" },
    { id: 78, sub_specialization: "Real-Time Systems", code: "IT_RTS_RTS" },
    { id: 79, sub_specialization: "Simulation and Modeling", code: "IT_SM_SIM" },
    { id: 80, sub_specialization: "IT Marketing", code: "IT_MARK_IT" },
    { id: 81, sub_specialization: "Knowledge Management", code: "IT_KM_KM" },
    { id: 82, sub_specialization: "Digital Ethics", code: "IT_DE_DE" },
    { id: 83, sub_specialization: "Cloud Security", code: "IT_CS_CLSEC" },
    { id: 84, sub_specialization: "Identity Management", code: "IT_IM_IDM" },
    { id: 85, sub_specialization: "Open Source Development", code: "IT_OS_OSD" },
    { id: 86, sub_specialization: "Semantic Web", code: "IT_SW_SW" },
    { id: 87, sub_specialization: "IT Governance", code: "IT_GOV_GOV" },
    { id: 88, sub_specialization: "Privacy Engineering", code: "IT_PE_PE" },
    { id: 89, sub_specialization: "Digital Transformation", code: "IT_DT_DT" },
    { id: 90, sub_specialization: "IT Strategy", code: "IT_STR_ITS" },
    { id: 91, sub_specialization: "IT Change Management", code: "IT_CM_CM" },
    { id: 92, sub_specialization: "IT Cost Management", code: "IT_CM_COST" },
    { id: 93, sub_specialization: "Collaborative Systems", code: "IT_CS_CS" },
    { id: 94, sub_specialization: "Global IT Services", code: "IT_GITS_GIT" },
    { id: 95, sub_specialization: "Digital Asset Management", code: "IT_DAM_DAM" },
    { id: 96, sub_specialization: "Electronic Voting Systems", code: "IT_EV_EVS" },
    { id: 97, sub_specialization: "Ethical Hacking", code: "IT_EH_EH" },
    { id: 98, sub_specialization: "IT Leadership", code: "IT_LD_LD" },
    { id: 99, sub_specialization: "Digital Twins", code: "IT_DT_DTW" },
    { id: 100, sub_specialization: "Sustainable IT", code: "IT_SUS_SIT" },

    // Engineering (101-150)
    { id: 101, sub_specialization: "Civil Engineering", code: "ENG_CE_CIV" },
    { id: 102, sub_specialization: "Mechanical Engineering", code: "ENG_ME_MCH" },
    { id: 103, sub_specialization: "Electrical Engineering", code: "ENG_EE_ELE" },
    { id: 104, sub_specialization: "Structural Engineering", code: "ENG_CE_STR" },
    { id: 105, sub_specialization: "Environmental Engineering", code: "ENG_ENV_ENV" },
    { id: 106, sub_specialization: "Chemical Engineering", code: "ENG_CHM_CHM" },
    { id: 107, sub_specialization: "Aerospace Engineering", code: "ENG_AER_AER" },
    { id: 108, sub_specialization: "Biomedical Engineering", code: "ENG_BME_BME" },
    { id: 109, sub_specialization: "Industrial Engineering", code: "ENG_IE_IND" },
    { id: 110, sub_specialization: "Marine Engineering", code: "ENG_MAR_MAR" },
    { id: 111, sub_specialization: "Petroleum Engineering", code: "ENG_PET_PET" },
    { id: 112, sub_specialization: "Geotechnical Engineering", code: "ENG_GEO_GEO" },
    { id: 113, sub_specialization: "Energy Engineering", code: "ENG_EN_ENE" },
    { id: 114, sub_specialization: "Transportation Engineering", code: "ENG_TR_TRANS" },
    { id: 115, sub_specialization: "Automotive Engineering", code: "ENG_AUTO_AUTO" },
    { id: 116, sub_specialization: "Mining Engineering", code: "ENG_MIN_MIN" },
    { id: 117, sub_specialization: "Nanotechnology Engineering", code: "ENG_NANO_NANO" },
    { id: 118, sub_specialization: "Railway Engineering", code: "ENG_RAIL_RAIL" },
    { id: 119, sub_specialization: "Surveying Engineering", code: "ENG_SURV_SURV" },
    { id: 120, sub_specialization: "Engineering Management", code: "ENG_EM_EM" },
    { id: 121, sub_specialization: "Acoustical Engineering", code: "ENG_ACOU_ACOU" },
    { id: 122, sub_specialization: "Agricultural Engineering", code: "ENG_AGRI_AGRI" },
    { id: 123, sub_specialization: "Robotics Engineering", code: "ENG_ROB_ROB" },
    { id: 124, sub_specialization: "Textile Engineering", code: "ENG_TX_TX" },
    { id: 125, sub_specialization: "Mechatronics", code: "ENG_MECH_ME" },
    { id: 126, sub_specialization: "Plastics Engineering", code: "ENG_PL_PL" },
    { id: 127, sub_specialization: "Water Resources Engineering", code: "ENG_WRE_WRE" },
    { id: 128, sub_specialization: "Fire Safety Engineering", code: "ENG_FS_FS" },
    { id: 129, sub_specialization: "Optical Engineering", code: "ENG_OPT_OPT" },
    { id: 130, sub_specialization: "Paper Engineering", code: "ENG_PAP_PAP" },
    { id: 131, sub_specialization: "Ceramic Engineering", code: "ENG_CER_CER" },
    { id: 132, sub_specialization: "Systems Engineering", code: "ENG_SYS_SYS" },
    { id: 133, sub_specialization: "Construction Management", code: "ENG_CON_CON" },
    { id: 134, sub_specialization: "Hydrology Engineering", code: "ENG_HYD_HYD" },
    { id: 135, sub_specialization: "Power Engineering", code: "ENG_PWR_PWR" },
    { id: 136, sub_specialization: "Thermal Engineering", code: "ENG_THE_THE" },
    { id: 137, sub_specialization: "Photonics Engineering", code: "ENG_PH_PH" },
    { id: 138, sub_specialization: "Nuclear Engineering", code: "ENG_NUC_NUC" },
    { id: 139, sub_specialization: "Sports Engineering", code: "ENG_SPT_SPT" },
    { id: 140, sub_specialization: "Instrumentation Engineering", code: "ENG_INS_INS" },
    { id: 141, sub_specialization: "Bridge Engineering", code: "ENG_BR_BR" },
    { id: 142, sub_specialization: "Materials Engineering", code: "ENG_MAT_MAT" },
    { id: 143, sub_specialization: "Ventilation Engineering", code: "ENG_VEN_VEN" },
    { id: 144, sub_specialization: "Pipeline Engineering", code: "ENG_PIPE_PIPE" },
    { id: 145, sub_specialization: "Aviation Engineering", code: "ENG_AV_AV" },
    { id: 146, sub_specialization: "Coastal Engineering", code: "ENG_COA_COA" },
    { id: 147, sub_specialization: "Dam Engineering", code: "ENG_DAM_DAM" },
    { id: 148, sub_specialization: "Immunology", code: "IMM_IMM_IMM" },
    { id: 149, sub_specialization: "Neuroscience", code: "NEURO_NEURO_NEURO" },
    { id: 150, sub_specialization: "Bioprocess Engineering", code: "ENG_BIO_BIO" }, 

    // Business & Management (151-200)
    { id: 151, sub_specialization: "Business Administration", code: "BUS_BA_BA" },
    { id: 152, sub_specialization: "Marketing", code: "BUS_MKT_MKT" },
    { id: 153, sub_specialization: "Finance", code: "BUS_FIN_FIN" },
    { id: 154, sub_specialization: "Human Resources", code: "BUS_HR_HR" },
    { id: 155, sub_specialization: "Accounting", code: "BUS_ACC_ACC" },
    { id: 156, sub_specialization: "Economics", code: "BUS_ECO_ECO" },
    { id: 157, sub_specialization: "Management Information Systems", code: "BUS_MIS_MIS" },
    { id: 158, sub_specialization: "Operations Management", code: "BUS_OPS_OPS" },
    { id: 159, sub_specialization: "Supply Chain Management", code: "BUS_SCM_SCM" },
    { id: 160, sub_specialization: "Project Management", code: "BUS_PROJ_PROJ" },
    { id: 161, sub_specialization: "International Business", code: "BUS_INT_INT" },
    { id: 162, sub_specialization: "Entrepreneurship", code: "BUS_ENT_ENT" },
    { id: 163, sub_specialization: "E-commerce", code: "BUS_ECOM_ECOM" },
    { id: 164, sub_specialization: "Digital Marketing", code: "BUS_DM_DM" },
    { id: 165, sub_specialization: "Marketing Research", code: "BUS_MR_MR" },
    { id: 166, sub_specialization: "Financial Management", code: "BUS_FM_FM" },
    { id: 167, sub_specialization: "Investment Banking", code: "BUS_IB_IB" },
    { id: 168, sub_specialization: "Corporate Finance", code: "BUS_CF_CF" },
    { id: 169, sub_specialization: "Accounting and Finance", code: "BUS_AF_AF" },
    { id: 170, sub_specialization: "Auditing", code: "BUS_AUD_AUD" },
    { id: 171, sub_specialization: "Taxation", code: "BUS_TAX_TAX" },
    { id: 172, sub_specialization: "Human Resource Management", code: "BUS_HRM_HRM" },
    { id: 173, sub_specialization: "Organizational Behavior", code: "BUS_OB_OB" },
    { id: 174, sub_specialization: "Industrial Psychology", code: "BUS_IP_IP" },
    { id: 175, sub_specialization: "Compensation and Benefits", code: "BUS_CB_CB" },
    { id: 176, sub_specialization: "Labor Relations", code: "BUS_LR_LR" },
    { id: 177, sub_specialization: "Training and Development", code: "BUS_TD_TD" },
    { id: 178, sub_specialization: "International Relations", code: "BUS_IR_IR" },
    { id: 179, sub_specialization: "Political Science", code: "POL_SCI_PS" },
    { id: 180, sub_specialization: "Sociology", code: "SOC_SOC_SOC" },
    { id: 181, sub_specialization: "Psychology", code: "PSY_PSY_PSY" },
    { id: 182, sub_specialization: "Law", code: "LAW_LAW_LAW" },
    { id: 183, sub_specialization: "Communication", code: "COMM_COMM_COMM" },
    { id: 184, sub_specialization: "Journalism", code: "JOUR_JOUR_JOUR" },
    { id: 185, sub_specialization: "Public Relations", code: "PR_PR_PR" },
    { id: 186, sub_specialization: "Advertising", code: "ADV_ADV_ADV" },
    { id: 187, sub_specialization: "Mass Communication", code: "MASS_COMM_MC" },
    { id: 188, sub_specialization: "Film Studies", code: "FILM_STUD_FS" },
    { id: 189, sub_specialization: "Media Studies", code: "MEDIA_STUD_MS" },
    { id: 190, sub_specialization: "Graphic Design", code: "GD_GD_GD" },
    { id: 191, sub_specialization: "Photography", code: "PHOTO_PHOTO_PHOTO" },
    { id: 192, sub_specialization: "Music", code: "MUSIC_MUSIC_MUSIC" },
    { id: 193, sub_specialization: "Fine Arts", code: "FINE_ARTS_FA" },
    { id: 194, sub_specialization: "Literature", code: "LIT_LIT_LIT" },
    { id: 195, sub_specialization: "History", code: "HIST_HIST_HIST" },
    { id: 196, sub_specialization: "Philosophy", code: "PHIL_PHIL_PHIL" },
    { id: 197, sub_specialization: "Religion", code: "REL_REL_REL" },
    { id: 198, sub_specialization: "Education", code: "EDU_EDU_EDU" },
    { id: 199, sub_specialization: "Social Work", code: "SW_SW_SW" },
    { id: 200, sub_specialization: "Healthcare Administration", code: "HCA_HCA_HCA" },
    { id: 201, sub_specialization: "Medicine", code: "MED_MED_MED" },
    { id: 202, sub_specialization: "Nursing", code: "NUR_NUR_NUR" },
    { id: 203, sub_specialization: "Pharmacy", code: "PHAR_PHAR_PHAR" },
    { id: 204, sub_specialization: "Dentistry", code: "DENT_DENT_DENT" },
    { id: 205, sub_specialization: "Veterinary Medicine", code: "VET_MED_VM" },
    { id: 206, sub_specialization: "Public Health", code: "PH_PH_PH" },
    { id: 207, sub_specialization: "Biochemistry", code: "BIOC_BIOC_BIOC" },
    { id: 208, sub_specialization: "Biophysics", code: "BIOPH_BIOPH_BIOPH" },
    { id: 209, sub_specialization: "Microbiology", code: "MICRO_MICRO_MICRO" },
    { id: 210, sub_specialization: "Genetics", code: "GEN_GEN_GEN" },
    
]



export const GetFields = (req, res) => {
    try {
        return res.status(200).json({
            message: "Skills fetched successfully",
            Fields: Fields
        });
    } catch (error) {
        console.error("Error fetching Skills: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const AddFieldsWithToken = async (req, res) => {
    try {
        if (!req.user) {
            console.log("User not authorized: No token provided.");
            return res.status(401).json({ message: "User not authorized. Please provide a valid token." });
        }

        const authUser = req.user;
        const { FieldId } = req.body;  

       
        if (!authUser || !FieldId) {
            console.log("Missing required fields: authUser or FieldId.");
            return res.status(400).json({ message: "User ID and Field ID are required." });
        }

        if (Array.isArray(FieldId)) {
            console.log("FieldId should not be an array. Please send only one FieldId.");
            return res.status(400).json({ message: "Please provide only one FieldId." });
        }

        console.log("Request received:", { authUser, FieldId });

        const fieldToAdd = Fields.find(field => field.id === FieldId);
        if (!fieldToAdd) {
            console.log("Field not found.");
            return res.status(404).json({ message: "Field not found in the predefined list." });
        }

        const user = await UserModel.findById(authUser);
        if (!user) {
            console.log("User not found in the database.");
            return res.status(404).json({ message: "User not found." });
        }

        console.log("User found:", user);

        const existingFields = user.Fields.map(field => field.id);
        if (existingFields.includes(fieldToAdd.id)) {
            console.log("The selected Field has already been added.");
            return res.status(400).json({ message: "The selected Field has already been added." });
        }

        user.Fields.push(fieldToAdd);
        await user.save();

        console.log("Field added successfully:", fieldToAdd);
        return res.status(200).json({
            message: "Field added successfully.",
            Fields: user.Fields
        });

    } catch (error) {
        console.error("Error adding Field: ", error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};

export const AddFieldsWithOutToken = async (req, res) => {
    try {
        const { FieldId } = req.body;

        if (!FieldId) {
            console.log("Missing required field: FieldId.");
            return res.status(400).json({ message: "Field ID is required." });
        }

        if (Array.isArray(FieldId)) {
            console.log("FieldId should not be an array. Please send only one FieldId.");
            return res.status(400).json({ message: "Please provide only one FieldId." });
        }

        console.log("Request received:", { FieldId });

        
        const fieldToAdd = Fields.find(field => field.id === FieldId);
        if (!fieldToAdd) {
            console.log("Field not found.");
            return res.status(404).json({ message: "Field not found in the predefined list." });
        }

        console.log("Field found:", fieldToAdd);
        return res.status(200).json({
            message: "Field selected successfully.",
            field: fieldToAdd
        });

    } catch (error) {
        console.error("Error adding Field: ", error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};





export const DeleteFields = async (req, res) => {
    try {
        if (!req.user) {
            console.log("User not authorized: No token provided.");
            return res.status(401).json({ message: "User not authorized. Please provide a valid token." });
        }

        const authUser = req.user;
        const { FieldsId } = req.body;

        if (!authUser || !FieldsId) {
            console.log("Missing required fields: authUser or FieldsId.");
            return res.status(400).json({ message: "User ID and fieldIndex ID are required." });
        }

        console.log("Request received to delete fieldIndex:", { authUser, FieldsId });

        const user = await UserModel.findById(authUser);
        if (!user) {
            console.log("User not found in the database.");
            return res.status(404).json({ message: "User not found." });
        }

        console.log("User found:", user);

        const fieldIndex = user.Fields.findIndex(field => field.id === FieldsId);
        if (fieldIndex === -1) {
            console.log("fieldIndex not found in user's Fields.");
            return res.status(404).json({ message: "fieldIndex not found for the user." });
        }

        user.Fields.splice(fieldIndex, 1);

        await user.save();

        console.log("fieldIndex deleted successfully. Remaining Fields:", user.Fields);
        return res.status(200).json({
            message: "fieldIndex deleted successfully.",
            Fields: user.Fields
        });

    } catch (error) {
        console.error("Error deleting fieldIndex: ", error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};

export const GetFieldsUser = async (req, res) => {
    try {
        if (!req.user) {
            console.log("User not authorized: No token provided.");
            return res.status(401).json({ message: "User not authorized. Please provide a valid token." });
        }

        const authUser = req.user;

        const user = await UserModel.findById(authUser);
        if (!user) {
            console.log("User not found in the database.");
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({
            message: "Fields fetched successfully.",
            Fields: user.Fields 
        });
        
    } catch (error) {
        console.error("Error fetching Fields: ", error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};










