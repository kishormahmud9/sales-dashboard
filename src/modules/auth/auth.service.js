import prisma from "../../config/prisma.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { generateTokens } from "../../lib/generateToken.js";
import DevBuildError from "../../lib/DevBuildError.js";

export const register = async (userData) => {
    const { name, email, password } = userData;
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        throw new DevBuildError("Email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.user.create({
        data: { name, email, password: hashedPassword }
    });
};

export const login = async (credentials) => {
    const { email, password } = credentials;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw new DevBuildError("User not found", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new DevBuildError("Invalid credentials", 400);
    }

    return generateTokens(user);
};

// ✅ Forgot Password - Step 1: Request OTP
export const forgotPassword = async (email) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new DevBuildError("User with this email does not exist", 404);
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Save OTP to user
    await prisma.user.update({
        where: { email },
        data: { otp, otpExpires }
    });

    // Send Email
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}. It will expire in 5 minutes.`
    };

    await transporter.sendMail(mailOptions);
};

// ✅ Forgot Password - Step 2: Verify OTP
export const verifyOtp = async (email, otp) => {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || user.otp !== otp || new Date() > user.otpExpires) {
        throw new DevBuildError("Invalid or expired OTP", 400);
    }

    return { message: "OTP verified successfully" };
};

// ✅ Forgot Password - Step 3: Reset Password
export const resetPassword = async (email, otp, newPassword) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.otp !== otp || new Date() > user.otpExpires) {
        throw new DevBuildError("Invalid or expired OTP", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { email },
        data: {
            password: hashedPassword,
            otp: null,
            otpExpires: null
        }
    });
};
