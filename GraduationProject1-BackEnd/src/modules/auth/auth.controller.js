import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SendEmail } from "../../../utls/SendEmail.js";
import { customAlphabet, nanoid } from 'nanoid';
import UserModel from '../../Model/User.Model.js';




export const SignUp = async (req, res) => {
    console.log('Received data:', req.body);
    const { FullName, Email, Password, ConfirmPassword, Gender, Role, BirthDate, PhoneNumber, Location, YearsOfExperience, Field } = req.body;
    const HashedPassword = bcrypt.hashSync(Password, parseInt(process.env.SALTROUND));
    const HashedConfirmPassword = bcrypt.hashSync(ConfirmPassword, parseInt(process.env.SALTROUND)); 

    try {
        if (YearsOfExperience > 0) {
            const YearsofExperienceN = parseInt(YearsOfExperience);
            const CreateUser = await UserModel.create({ FullName, Email, Password: HashedPassword, ConfirmPassword:HashedConfirmPassword, Gender, Role, BirthDate, PhoneNumber, Location, YearsOfExperience: YearsofExperienceN, Field });
            const token = jwt.sign({ Email }, process.env.CONFIRM_EMAILTOKEN);
            return res.status(201).json({ message: "success", user: CreateUser, token: token });
        } else {
            const CreateUser = await UserModel.create({ FullName, Email, Password: HashedPassword, ConfirmPassword:HashedConfirmPassword, Gender, BirthDate, PhoneNumber, Location, YearsOfExperience, Field });
            const token = jwt.sign({ Email }, process.env.CONFIRM_EMAILTOKEN);
            return res.status(201).json({ message: "success", user: CreateUser, token: token });
        }
    } catch (error) {
        console.error("Error during user creation:", error.message);
        return res.status(error.statusCode || 500).json({ message: error.message || "Server error" });
    }
};


export const SignIn = async (req, res) => {
    console.log('Received data:', req.body);
    const { Email, Password } = req.body;

    try {
        const user = await UserModel.findOne({ Email });

        if (!user) {
            return res.status(400).json({ message: "The entered email is invalid, try again!" });
        }

        const Match = await bcrypt.compare(Password, user.Password);

        if (!Match) {
            return res.status(400).json({ message: "Wrong password, try again!" });
        }

        const token = jwt.sign({ id: user._id, role: user.Role }, process.env.LOGINSIG);

        const userData = user.toObject();
        delete userData.Password;
        delete userData.ConfirmPassword;

        return res.status(200).json({
            message: "Success",
            token,
            user: userData
        });
    } catch (error) {
        console.error("Error during SignIn:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};



export const SendCode = async (req, res) => {
    const { Email } = req.body;  // تأكد من أن هذا الحقل يتوافق مع اسم الحقل الذي يرسله React Native
    console.log("Sending code to email:", Email);  // التصحيح هنا
    const Code = customAlphabet('1234567890abcdef', 4)();
    const user = await UserModel.findOneAndUpdate({ Email }, { SendCode: Code }, { new: true });

    if (!user) {
        console.log("User not found with email:", Email); 
        return res.status(400).json({ message: "Email not found" });
    }    

    await SendEmail(Email, `Reset Password`, `<h2>Code is ${Code}</h2>`);
    return res.status(200).json({ message: "Success", user });
};



export const ForgotPassword = async (req, res) => {
    const { Email,code } = req.body;
    const user = await UserModel.findOne({ Email });
    if (!user) {
        return res.status(404).json({ message: "user not found" });

    }

    if (user.SendCode != code) {
        return res.status(404).json({ message: "invalid code" });
    }

    return res.status(200).json({ message: " success" });


};


export const ChangePassword = async (req, res) => {
    const { Email, NewPassword, ConfirmNewPassword } = req.body;

    if (NewPassword !== ConfirmNewPassword) {
        return res.status(400).json({ message: "New passwords do not match" });
    }

    if (!NewPassword) {
        return res.status(400).json({ message: "Password is required" });
    }

    const user = await UserModel.findOne({ Email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    try {
        const HashedPassword = bcrypt.hashSync(NewPassword, parseInt(process.env.SALTROUND));
        const HashedConfirmNewPassword = bcrypt.hashSync(ConfirmNewPassword, parseInt(process.env.SALTROUND)); 

        
        user.Password = HashedPassword;
        user.ConfirmPassword = HashedConfirmNewPassword;
        await user.save();

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error during password update:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};


