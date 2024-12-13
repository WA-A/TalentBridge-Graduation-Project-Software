// ملف الـ controller
const languages = [
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

export const GetLanguages = (req, res) => {
    try {
        return res.status(200).json({
            message: "Languages fetched successfully",
            languages: languages
        });
    } catch (error) {
        console.error("Error fetching languages: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

 