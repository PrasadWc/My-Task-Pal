import Users from "../models/userModel.js";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import transporter from "../config/nodemailer.js";

//Create new User
export const createUser = async(req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const { name,email } = req.body;
    const newUser = new Users({
        name,
        email,
        password: hashedPassword
    });

    try {
        await newUser.save();
        res.status(201).json({ message: "User Added successfully" });
    }catch (error) {
        res.status(500).json(error.message);
      }
};

//Login with Authentication
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Entered Email is incorrect" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Password is incorrect. Authentication failed" });
        }

        const token = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JWT_SECRET_Key,
            { expiresIn: "1h" }
        );

        // Set the cookie and send a response
        res.cookie("authToken", token, { 
            httpOnly: true, 
            secure: false
        });

        return res.status(200).json({ message: "Login successful",token  });

    } catch (error) {
        return res.status(500).json({ message: error.message,});
    }
};

//get user

export const getUser = async (req, res) => {
    try {
        const user = await Users.findById(req.user.id).select("-password -resetOtp -resetOtpExpireAt"); // Exclude password, otp releated data

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//Check user authentication
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({success: true});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

//send password reset otp
export const sendPasswordResetOTP = async (req, res) => {
    const { email } = req.body;

    if(!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for resetting password is ${otp}. Use this to procees with resetting password`
        };

        await transporter.sendMail(mailOption);

        return res.json({ message: "OTP sent successfully" });

    } catch (error) {
       return res.json({success: false, message: error.message});
    }
}

//reset password
export const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body;

    if(!email ||!otp ||!newPassword) {
        return res.status(400).json({ message: "Email, OTP and new password are required" });
    }
    try {
        const user = await Users.findOne({email});
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        if(user.resetOtp === "" || user.resetOtp !== otp) {
            return res.json({ message: "OTP is invalid" });
        }
        if(user.resetOtpExpireAt < Date.now()){
            return res.json({ message: "OTP is Expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;

        await user.save();
        return res.json({ message: "Password reset successfully" });
        
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

//change password after logging in
export const changePassword = async (req, res) => {
    const {currentPassword, newPassword} = req.body;

    if(!currentPassword ||!newPassword) {
        return res.status(400).json({ message: "old and new password are required" });
    }
    if(currentPassword === newPassword) {
        return res.status(400).json({ message: "you cant use current password again." });
    }
    
    try {
        const user = await Users.findById(req.user.id);

        // Compare the currentPassword with the hashed password in database
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ 
                message: "Current password is incorrect." 
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();
        return res.json({ message: "Password changed successfully" });
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}