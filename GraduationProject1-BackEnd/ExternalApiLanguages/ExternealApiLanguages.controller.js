import UserModel from '../src/Model/User.Model.js';

const Languages = [
    { id: 1, name: "English", code: "en" },
    { id: 2, name: "Arabic", code: "ar" },
    { id: 3, name: "French", code: "fr" },
    { id: 4, name: "Spanish", code: "es" },
    { id: 5, name: "Chinese", code: "zh" },
    { id: 6, name: "German", code: "de" },
    { id: 7, name: "Russian", code: "ru" },
    { id: 8, name: "Italian", code: "it" },
    { id: 9, name: "Portuguese", code: "pt" },
    { id: 10, name: "Japanese", code: "ja" },
    { id: 11, name: "Korean", code: "ko" },
    { id: 12, name: "Turkish", code: "tr" },
    { id: 13, name: "Dutch", code: "nl" },
    { id: 14, name: "Swedish", code: "sv" },
    { id: 15, name: "Polish", code: "pl" },
    { id: 16, name: "Danish", code: "da" },
    { id: 17, name: "Norwegian", code: "no" },
    { id: 18, name: "Finnish", code: "fi" },
    { id: 19, name: "Greek", code: "el" },
    { id: 20, name: "Hungarian", code: "hu" },
    { id: 21, name: "Czech", code: "cs" },
    { id: 22, name: "Romanian", code: "ro" },
    { id: 23, name: "Hebrew", code: "he" },
    { id: 24, name: "Thai", code: "th" },
    { id: 25, name: "Hindi", code: "hi" },
    { id: 26, name: "Bengali", code: "bn" },
    { id: 27, name: "Vietnamese", code: "vi" },
    { id: 28, name: "Indonesian", code: "id" },
    { id: 29, name: "Malay", code: "ms" },
    { id: 30, name: "Swahili", code: "sw" },
    { id: 31, name: "Zulu", code: "zu" },
    { id: 32, name: "Tamil", code: "ta" },
    { id: 33, name: "Telugu", code: "te" },
    { id: 34, name: "Marathi", code: "mr" },
    { id: 35, name: "Punjabi", code: "pa" },
    { id: 36, name: "Urdu", code: "ur" },
    { id: 37, name: "Kazakh", code: "kk" },
    { id: 38, name: "Ukrainian", code: "uk" },
    { id: 39, name: "Croatian", code: "hr" },
    { id: 40, name: "Serbian", code: "sr" }
];

export const AddLanguages = async (req, res) => {
    try {
        if (!req.user) {
            console.log("User not authorized: No token provided.");
            return res.status(401).json({ message: "User not authorized. Please provide a valid token." });
        }

        const authUser = req.user;
        const { LanguageIds } = req.body;  // يجب أن تكون هذه مجموعة من الـ IDs للغات

        if (!authUser || !LanguageIds || !Array.isArray(LanguageIds)) {
            console.log("Missing required fields: authUser or LanguageIds.");
            return res.status(400).json({ message: "User ID and Language IDs are required." });
        }

        console.log("Request received:", { authUser, LanguageIds });

        // التحقق من وجود اللغات في القائمة المبدئية
        const languagesToAdd = LanguageIds.map(id => Languages.find(lang => lang.id === id))
                                        .filter(lang => lang); // تصفية اللغات غير الموجودة

        if (languagesToAdd.length !== LanguageIds.length) {
            console.log("Some languages were not found.");
            return res.status(404).json({ message: "Some languages were not found in the predefined list." });
        }

        const user = await UserModel.findById(authUser);
        if (!user) {
            console.log("User not found in the database.");
            return res.status(404).json({ message: "User not found." });
        }

        console.log("User found:", user);

        // إضافة اللغات إلى المستخدم إذا لم تكن موجودة بالفعل
        const existingLanguages = user.Languages.map(lang => lang.id);
        const newLanguages = languagesToAdd.filter(lang => !existingLanguages.includes(lang.id));

        if (newLanguages.length === 0) {
            console.log("All selected languages already added.");
            return res.status(400).json({ message: "All selected languages already added." });
        }

        // إضافة اللغات الجديدة إلى المستخدم
        user.Languages.push(...newLanguages);
        await user.save();

        console.log("Languages added successfully:", newLanguages);
        return res.status(200).json({
            message: "Languages added successfully.",
            languages: user.Languages
        });

    } catch (error) {
        console.error("Error adding languages: ", error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};


export const GetLanguages = (req, res) => {
    try {
        return res.status(200).json({
            message: "Languages fetched successfully",
            languages: Languages
        });
    } catch (error) {
        console.error("Error fetching languages: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const DeleteLanguages = async (req, res) => {
    try {
        if (!req.user) {
            console.log("User not authorized: No token provided.");
            return res.status(401).json({ message: "User not authorized. Please provide a valid token." });
        }

        const authUser = req.user;
        const { LanguageId } = req.body;

        if (!authUser || !LanguageId) {
            console.log("Missing required fields: authUser or LanguageId.");
            return res.status(400).json({ message: "User ID and Language ID are required." });
        }

        console.log("Request received to delete language:", { authUser, LanguageId });

        const user = await UserModel.findById(authUser);
        if (!user) {
            console.log("User not found in the database.");
            return res.status(404).json({ message: "User not found." });
        }

        console.log("User found:", user);

        const languageIndex = user.Languages.findIndex(lang => lang.id === LanguageId);
        if (languageIndex === -1) {
            console.log("Language not found in user's languages.");
            return res.status(404).json({ message: "Language not found for the user." });
        }

        user.Languages.splice(languageIndex, 1);

        await user.save();

        console.log("Language deleted successfully. Remaining languages:", user.Languages);
        return res.status(200).json({
            message: "Language deleted successfully.",
            languages: user.Languages
        });

    } catch (error) {
        console.error("Error deleting language: ", error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};


// دالة GET لاسترجاع اللغات الخاصة بالمستخدم
export const GetLanguagesUser = async (req, res) => {
    try {
        // التأكد من وجود المستخدم في التوكن
        if (!req.user) {
            console.log("User not authorized: No token provided.");
            return res.status(401).json({ message: "User not authorized. Please provide a valid token." });
        }

        const authUser = req.user;

        // البحث عن المستخدم في قاعدة البيانات باستخدام معرّف المستخدم
        const user = await UserModel.findById(authUser);
        if (!user) {
            console.log("User not found in the database.");
            return res.status(404).json({ message: "User not found." });
        }

        // إرجاع اللغات الخاصة بالمستخدم
        return res.status(200).json({
            message: "Languages fetched successfully.",
            languages: user.Languages // إرجاع اللغات المخزنة في قاعدة البيانات
        });
        
    } catch (error) {
        console.error("Error fetching languages: ", error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};