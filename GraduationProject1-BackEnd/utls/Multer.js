import 'dotenv/config';
import cloudinary from 'cloudinary';
import multer from 'multer';

// إضافة دعم لملفات ZIP
export const FileValue = {
    image: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
    file: ['application/pdf', 'application/zip', 'application/x-zip-compressed', 'multipart/x-zip'],
    video: ['video/mp4', 'video/x-msvideo', 'video/x-matroska'],
};

// تحديث دالة fileUpload لإضافة دعم لملفات ZIP
function fileUpload(customValue = []) {
    console.log(customValue);

    const storage = multer.diskStorage({
        // يمكن تخصيص الوجهة واسم الملف هنا إذا لزم الأمر
    });

    function fileFilter(req, file, cb) {
        console.log("File mimetype:", file.mimetype); // سطر لفحص نوع mimetype
        if (customValue.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file format"), false);
        }
    }

    const upload = multer({ storage, fileFilter });
    return upload;
}

export default fileUpload;
