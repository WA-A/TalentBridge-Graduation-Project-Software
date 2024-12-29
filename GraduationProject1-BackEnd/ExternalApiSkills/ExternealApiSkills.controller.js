import UserModel from '../src/Model/User.Model.js';

const Skills = [
    { id: 1, name: "Python", code: "py" },
    { id: 2, name: "Java", code: "ja" },
    { id: 3, name: "C++", code: "c+" },
    { id: 4, name: "JavaScript", code: "js" },
    { id: 5, name: "SQL", code: "sq" },
    { id: 6, name: "HTML", code: "ht" },
    { id: 7, name: "CSS", code: "cs" },
    { id: 8, name: "React", code: "re" },
    { id: 9, name: "Angular", code: "an" },
    { id: 10, name: "Node.js", code: "no" },
    { id: 11, name: "PHP", code: "ph" },
    { id: 12, name: "Ruby", code: "ru" },
    { id: 13, name: "Swift", code: "sw" },
    { id: 14, name: "Kotlin", code: "ko" },
    { id: 15, name: "Django", code: "dj" },
    { id: 16, name: "Flask", code: "fl" },
    { id: 17, name: "Spring", code: "sp" },
    { id: 18, name: "Laravel", code: "la" },
    { id: 19, name: "TensorFlow", code: "tf" },
    { id: 20, name: "PyTorch", code: "pt" },
    { id: 21, name: "Tableau", code: "tb" },
    { id: 22, name: "Power BI", code: "pb" },
    { id: 23, name: "Excel", code: "ex" },
    { id: 24, name: "R", code: "r" },
    { id: 25, name: "MATLAB", code: "ml" },
    { id: 26, name: "Hadoop", code: "ha" },
    { id: 27, name: "Spark", code: "sp" },
    { id: 28, name: "AWS", code: "aw" },
    { id: 29, name: "Azure", code: "az" },
    { id: 30, name: "Google Cloud", code: "gc" },
    { id: 31, name: "Docker", code: "do" },
    { id: 32, name: "Kubernetes", code: "ku" },
    { id: 33, name: "Git", code: "gi" },
    { id: 34, name: "GitHub", code: "gh" },
    { id: 35, name: "Linux", code: "li" },
    { id: 36, name: "Unix", code: "un" },
    { id: 37, name: "Shell Scripting", code: "sh" },
    { id: 38, name: "C#", code: "c#" },
    { id: 39, name: "TypeScript", code: "ts" },
    { id: 40, name: "Bootstrap", code: "bo" },
    { id: 41, name: "SASS", code: "sa" },
    { id: 42, name: "Vue.js", code: "vu" },
    { id: 43, name: "ASP.NET", code: "as" },
    { id: 44, name: "GraphQL", code: "gq" },
    { id: 45, name: "MongoDB", code: "mo" },
    { id: 46, name: "PostgreSQL", code: "ps" },
    { id: 47, name: "Firebase", code: "fb" },
    { id: 48, name: "Redis", code: "rd" },
    { id: 49, name: "Elasticsearch", code: "el" },
    { id: 50, name: "Next.js", code: "nx" },
    { id: 51, name: "Jenkins", code: "jk" },
    { id: 52, name: "Ansible", code: "as" },
    { id: 53, name: "Terraform", code: "tf" },
    { id: 54, name: "Salesforce", code: "sf" },
    { id: 55, name: "ServiceNow", code: "sn" },
    { id: 56, name: "Figma", code: "fg" },
    { id: 57, name: "Adobe XD", code: "ad" },
    { id: 58, name: "Sketch", code: "sk" },
    { id: 59, name: "Canva", code: "ca" },
    { id: 60, name: "Blender", code: "bl" },
    { id: 61, name: "Unity", code: "un" },
    { id: 62, name: "Unreal Engine", code: "ue" },
    { id: 63, name: "Machine Learning", code: "ml" },
    { id: 64, name: "Deep Learning", code: "dl" },
    { id: 65, name: "Data Analysis", code: "da" },
    { id: 66, name: "Cybersecurity", code: "cy" },
    { id: 67, name: "Penetration Testing", code: "pt" },
    { id: 68, name: "Blockchain", code: "bc" },
    { id: 69, name: "IoT", code: "iot" },
    { id: 70, name: "AR/VR Development", code: "arvr" },
        { id: 71, name: "Business Analysis", code: "ba" },
        { id: 72, name: "Project Management", code: "pm" },
        { id: 73, name: "Agile Methodologies", code: "am" },
        { id: 74, name: "Scrum", code: "sc" },
        { id: 75, name: "DevOps", code: "dv" },
        { id: 76, name: "Microservices", code: "ms" },
        { id: 77, name: "Event-Driven Architecture", code: "eda" },
        { id: 78, name: "RESTful APIs", code: "api" },
        { id: 79, name: "Software Testing", code: "st" },
        { id: 80, name: "Test Automation", code: "ta" },
        { id: 81, name: "Quality Assurance", code: "qa" },
        { id: 82, name: "Integration Testing", code: "it" },
        { id: 83, name: "Load Testing", code: "lt" },
        { id: 84, name: "UI/UX Design", code: "ux" },
        { id: 85, name: "Wireframing", code: "wf" },
        { id: 86, name: "Prototyping", code: "pt" },
        { id: 87, name: "Digital Marketing", code: "dm" },
        { id: 88, name: "SEO", code: "seo" },
        { id: 89, name: "Content Marketing", code: "cm" },
        { id: 90, name: "Social Media Marketing", code: "smm" },
        { id: 91, name: "Email Marketing", code: "em" },
        { id: 92, name: "Copywriting", code: "cw" },
        { id: 93, name: "Affiliate Marketing", code: "af" },
        { id: 94, name: "Brand Management", code: "bm" },
        { id: 95, name: "E-commerce", code: "ec" },
        { id: 96, name: "CRM Tools", code: "crm" },
        { id: 97, name: "Data Visualization", code: "dvz" },
        { id: 98, name: "Big Data", code: "bd" },
        { id: 99, name: "Data Mining", code: "dmn" },
        { id: 100, name: "Natural Language Processing", code: "nlp" },
        { id: 101, name: "Image Processing", code: "ip" },
        { id: 102, name: "Computer Vision", code: "cv" },
        { id: 103, name: "Reinforcement Learning", code: "rl" },
        { id: 104, name: "Speech Recognition", code: "sr" },
        { id: 105, name: "Audio Signal Processing", code: "asp" },
        { id: 106, name: "Video Editing", code: "ve" },
        { id: 107, name: "Animation", code: "an" },
        { id: 108, name: "Game Design", code: "gd" },
        { id: 109, name: "Game Development", code: "gdev" },
        { id: 110, name: "3D Modeling", code: "3d" },
        { id: 111, name: "Motion Graphics", code: "mg" },
        { id: 112, name: "Augmented Reality", code: "ar" },
        { id: 113, name: "Virtual Reality", code: "vr" },
        { id: 114, name: "ERP Systems", code: "erp" },
        { id: 115, name: "SAP", code: "sap" },
        { id: 116, name: "Oracle E-Business Suite", code: "oe" },
        { id: 117, name: "Risk Management", code: "rm" },
        { id: 118, name: "Financial Analysis", code: "fa" },
        { id: 119, name: "Accounting", code: "acc" },
        { id: 120, name: "Investment Management", code: "im" },
        { id: 121, name: "Forex Trading", code: "fx" },
        { id: 122, name: "Cryptocurrency", code: "crypto" },
        { id: 123, name: "Quantitative Analysis", code: "qa" },
        { id: 124, name: "Human Resources", code: "hr" },
        { id: 125, name: "Recruitment", code: "rec" },
        { id: 126, name: "Talent Management", code: "tm" },
        { id: 127, name: "Training and Development", code: "td" },
        { id: 128, name: "Employee Relations", code: "er" },
        { id: 129, name: "Payroll Management", code: "pm" },
        { id: 130, name: "Healthcare Management", code: "hm" },
        { id: 131, name: "Public Health", code: "ph" },
        { id: 132, name: "Clinical Research", code: "cr" },
        { id: 133, name: "Pharmaceuticals", code: "pharm" },
        { id: 134, name: "Biotechnology", code: "bio" },
        { id: 135, name: "Environmental Science", code: "es" },
        { id: 136, name: "Renewable Energy", code: "re" },
        { id: 137, name: "Sustainable Development", code: "sd" },
        { id: 138, name: "Civil Engineering", code: "ce" },
        { id: 139, name: "Mechanical Engineering", code: "me" },
        { id: 140, name: "Electrical Engineering", code: "ee" },
        { id: 141, name: "Chemical Engineering", code: "che" },
        { id: 142, name: "Aerospace Engineering", code: "ae" },
        { id: 143, name: "Industrial Design", code: "id" },
        { id: 144, name: "Urban Planning", code: "up" },
        { id: 145, name: "Architecture", code: "arch" },
        { id: 146, name: "Interior Design", code: "intd" },
        { id: 147, name: "Fashion Design", code: "fd" },
        { id: 148, name: "Event Planning", code: "ep" },
        { id: 149, name: "Photography", code: "photo" },
        { id: 150, name: "Videography", code: "video" },
            { id: 151, name: "Audio Engineering", code: "audio" },
            { id: 152, name: "Music Production", code: "music" },
            { id: 153, name: "Songwriting", code: "song" },
            { id: 154, name: "Voice Acting", code: "va" },
            { id: 155, name: "Public Speaking", code: "ps" },
            { id: 156, name: "Negotiation", code: "neg" },
            { id: 157, name: "Conflict Resolution", code: "cr" },
            { id: 158, name: "Leadership", code: "lead" },
            { id: 159, name: "Team Management", code: "tm" },
            { id: 160, name: "Strategic Planning", code: "sp" },
            { id: 161, name: "Time Management", code: "time" },
            { id: 162, name: "Critical Thinking", code: "ct" },
            { id: 163, name: "Problem Solving", code: "psolve" },
            { id: 164, name: "Decision Making", code: "dm" },
            { id: 165, name: "Creative Writing", code: "cw" },
            { id: 166, name: "Technical Writing", code: "tw" },
            { id: 167, name: "Grant Writing", code: "gw" },
            { id: 168, name: "Editing", code: "edit" },
            { id: 169, name: "Proofreading", code: "proof" },
            { id: 170, name: "Translation", code: "trans" },
            { id: 171, name: "Interpretation", code: "interp" },
            { id: 172, name: "Foreign Languages", code: "fl" },
            { id: 173, name: "Teaching", code: "teach" },
            { id: 174, name: "Curriculum Development", code: "cd" },
            { id: 175, name: "Instructional Design", code: "id" },
            { id: 176, name: "E-learning Development", code: "elearn" },
            { id: 177, name: "Tutoring", code: "tutor" },
            { id: 178, name: "Coaching", code: "coach" },
            { id: 179, name: "Mentorship", code: "mentor" },
            { id: 180, name: "Life Coaching", code: "lc" },
            { id: 181, name: "Personal Development", code: "pd" },
            { id: 182, name: "Fitness Training", code: "ft" },
            { id: 183, name: "Yoga Instruction", code: "yoga" },
            { id: 184, name: "Nutrition Planning", code: "np" },
            { id: 185, name: "Wellness Coaching", code: "wc" },
            { id: 186, name: "Physical Therapy", code: "pt" },
            { id: 187, name: "Occupational Therapy", code: "ot" },
            { id: 188, name: "Speech Therapy", code: "st" },
            { id: 189, name: "Nursing", code: "nurse" },
            { id: 190, name: "Pharmacy", code: "pharm" },
            { id: 191, name: "Healthcare Administration", code: "ha" },
            { id: 192, name: "Clinical Psychology", code: "cp" },
            { id: 193, name: "Counseling", code: "counsel" },
            { id: 194, name: "Social Work", code: "sw" },
            { id: 195, name: "Childcare", code: "cc" },
            { id: 196, name: "Elder Care", code: "ec" },
            { id: 197, name: "Pet Care", code: "pc" },
            { id: 198, name: "Veterinary Medicine", code: "vet" },
            { id: 199, name: "Zoology", code: "zoo" },
            { id: 200, name: "Marine Biology", code: "mb" }
    
        
    
];


export const AddSkills = async (req, res) => {
    try {
        if (!req.user) {
            console.log("User not authorized: No token provided.");
            return res.status(401).json({ message: "User not authorized. Please provide a valid token." });
        }

        const authUser = req.user;
        const { SkillsWithRates } = req.body;  

        if (!authUser || !Array.isArray(SkillsWithRates) || SkillsWithRates.length === 0) {
            console.log("Missing required fields: authUser or SkillsWithRates.");
            return res.status(400).json({ message: "User ID and SkillsWithRates are required, and must be a non-empty array." });
        }

        console.log("Request received:", { authUser, SkillsWithRates });

        const user = await UserModel.findById(authUser);
        if (!user) {
            console.log("User not found in the database.");
            return res.status(404).json({ message: "User not found." });
        }

        console.log("User found:", user);

        const addedSkills = [];
        const failedSkills = [];

        user.Skills = user.Skills.map(skill => ({
            ...skill,
            Rate: skill.Rate || 1 
        }));

        for (const { SkillId, Rate } of SkillsWithRates) {
            if (Rate === undefined || Rate < 1 || Rate > 5) {
                console.log(`Invalid or missing rate for SkillId ${SkillId}: ${Rate}`);
                failedSkills.push(SkillId);
                continue;
            }
        
            const skillIdNum = parseInt(SkillId);
            const selectedSkill = Skills.find(skill => skill.id === skillIdNum);
            
            if (!selectedSkill) {
                console.log(`Skill not found: ${SkillId}`);
                failedSkills.push(SkillId);
                continue;
            }
        
            const skillExists = user.Skills.some(skill => skill.id === selectedSkill.id);
            if (skillExists) {
                console.log(`Skill already exists for user: ${SkillId}`);
                failedSkills.push(SkillId);
                continue;
            }
        
            user.Skills.push({
                id: selectedSkill.id,
                name: selectedSkill.name,
                code: selectedSkill.code,
                Rate: Rate  
            });
        
            addedSkills.push({ ...selectedSkill, Rate: Rate });
        }

        await user.save();

        console.log("Skills added successfully.");
        return res.status(200).json({
            message: "Skills processed successfully.",
            addedSkills,
            failedSkills,
            userSkills: user.Skills
        });

    } catch (error) {
        console.error("Error adding skills:", error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};



export const DeleteSkill = async (req, res) => {
    try {
        if (!req.user) {
            console.log("User not authorized: No token provided.");
            return res.status(401).json({ message: "User not authorized. Please provide a valid token." });
        }

        const authUser = req.user;
        const { SkillId } = req.body;

        if (!authUser || !SkillId) {
            console.log("Missing required fields: authUser or SkillId.");
            return res.status(400).json({ message: "User ID and Skill ID are required." });
        }

        console.log("Request received:", { authUser, SkillId });

        const user = await UserModel.findById(authUser);
        if (!user) {
            console.log("User not found in the database.");
            return res.status(404).json({ message: "User not found." });
        }

        console.log("User found:", user);

        const skillIndex = user.Skills.findIndex(skill => skill.id === SkillId);
        if (skillIndex === -1) {
            console.log("Skill not found for user.");
            return res.status(404).json({ message: "Skill not found." });
        }

        user.Skills.splice(skillIndex, 1); 

        await user.save();

        console.log("Skill deleted successfully.");
        return res.status(200).json({
            message: "Skill deleted successfully.",
            skills: user.Skills
        });

    } catch (error) {
        console.error("Error deleting skill: ", error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};



export const GetSkills = (req, res) => {
    try {
        return res.status(200).json({
            message: "Skills fetched successfully",
            Skills: Skills
        });
    } catch (error) {
        console.error("Error fetching Skills: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const GetUserSkills = async (req, res) => {
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

        console.log("User found:", user);

        const userSkills = user.Skills;

        if (userSkills.length === 0) {
            return res.status(404).json({ message: "No skills added yet." });
        }

        console.log("User skills:", userSkills);
        return res.status(200).json({
            message: "User skills fetched successfully.",
            skills: userSkills
        });

    } catch (error) {
        console.error("Error fetching user skills: ", error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};


export const AddMoreSkills = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ 
                status: "error",
                message: "User not authorized. Please provide a valid token." 
            });
        }

        const authUser = req.user;
        const { SkillsWithRates } = req.body;

        if (!authUser || !Array.isArray(SkillsWithRates) || SkillsWithRates.length === 0) {
            return res.status(400).json({ 
                status: "error",
                message: "User ID and SkillsWithRates are required, and must be a non-empty array." 
            });
        }

        const user = await UserModel.findById(authUser);
        if (!user) {
            return res.status(404).json({ 
                status: "error",
                message: "User not found." 
            });
        }

        const addedSkills = [];
        const errors = {
            existingSkills: [],
            invalidRates: [],
            notFoundSkills: []
        };

        user.Skills = user.Skills.map(skill => ({
            ...skill,
            Rate: skill.Rate || 1
        }));

        for (const { SkillId, Rate } of SkillsWithRates) {
            if (Rate === undefined || Rate < 1 || Rate > 5) {
                errors.invalidRates.push({
                    skillId: SkillId,
                    providedRate: Rate,
                    message: `Invalid rate: ${Rate}. Rate must be between 1 and 5.`
                });
                continue;
            }
        
            const skillIdNum = parseInt(SkillId);
            const selectedSkill = Skills.find(skill => skill.id === skillIdNum);
            
            if (!selectedSkill) {
                errors.notFoundSkills.push({
                    skillId: SkillId,
                    message: `Skill with ID ${SkillId} was not found in the system.`
                });
                continue;
            }
        
            const skillExists = user.Skills.some(skill => skill.id === selectedSkill.id);
            if (skillExists) {
                errors.existingSkills.push({
                    skillId: SkillId,
                    message: `Skill with ID ${SkillId} is already added to user's profile.`
                });
                continue;
            }
        
            user.Skills.push({
                id: selectedSkill.id,
                name: selectedSkill.name,
                code: selectedSkill.code,
                Rate: Rate
            });
        
            addedSkills.push({ ...selectedSkill, Rate: Rate });
        }

        await user.save();

        return res.status(200).json({
            status: "success",
            message: "Skills processing completed",
            results: {
                addedSkills: {
                    count: addedSkills.length,
                    skills: addedSkills
                },
                errors: {
                    existingSkills: {
                        count: errors.existingSkills.length,
                        skills: errors.existingSkills
                    },
                    invalidRates: {
                        count: errors.invalidRates.length,
                        skills: errors.invalidRates
                    },
                    notFoundSkills: {
                        count: errors.notFoundSkills.length,
                        skills: errors.notFoundSkills
                    }
                },
                currentUserSkills: user.Skills
            }
        });

    } catch (error) {
        return res.status(500).json({ 
            status: "error",
            message: "Internal Server Error.",
            error: error.message 
        });
    }
};

