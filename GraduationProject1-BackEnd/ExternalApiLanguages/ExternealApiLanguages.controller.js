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
        const { LanguageId } = req.body;

        if (!authUser || !LanguageId) {
            console.log("Missing required fields: authUser or LanguageId.");
            return res.status(400).json({ message: "User ID and Language ID are required." });
        }

        console.log("Request received:", { authUser, LanguageId });

        const selectedLanguage = Languages.find(lang => lang.id === LanguageId);
        if (!selectedLanguage) {
            console.log("Language not found in predefined list.");
            return res.status(404).json({ message: "Language not found." });
        }

        console.log("Selected language:", selectedLanguage);

        if (!selectedLanguage.id || !selectedLanguage.name || !selectedLanguage.code) {
            return res.status(400).json({ message: "Selected language is missing required fields." });
        }

        const user = await UserModel.findById(authUser);
        if (!user) {
            console.log("User not found in the database.");
            return res.status(404).json({ message: "User not found." });
        }

        console.log("User found:", user);

        const languageExists = user.Languages.some(lang => lang.id === selectedLanguage.id);
        if (languageExists) {
            console.log("Language already exists for user.");
            return res.status(400).json({ message: "Language already added." });
        }

        user.Languages.push({
            id: selectedLanguage.id,
            name: selectedLanguage.name,
            code: selectedLanguage.code
        });

        await user.save();

        console.log("Language added successfully:", selectedLanguage);
        return res.status(200).json({
            message: "Language added successfully.",
            languages: user.Languages
        });

    } catch (error) {
        console.error("Error adding language: ", error);
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


