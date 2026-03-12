import jwt from "jsonwebtoken";
import DevBuildError from "../../lib/DevBuildError.js";
import * as authService from "./auth.service.js";

// ✅ User Registration
export const registerUser = async (req, res, next) => {
    try {
        await authService.register(req.body);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        next(error);
    }
};

// ✅ User Login
export const loginUser = async (req, res, next) => {
    try {
        const tokens = await authService.login(req.body);
        res.status(200).json({ message: "Login successful", ...tokens });
    } catch (error) {
        next(error);
    }
};

// ✅ Refresh Token
export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) throw new DevBuildError("Refresh token required", 401);

        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, decoded) => {
            if (err) {
                return next(new DevBuildError("Invalid refresh token", 403));
            }

            const accessToken = jwt.sign(
                { id: decoded.id, email: decoded.email, role: decoded.role },
                process.env.JWT_SECRET_TOKEN,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.status(200).json({ accessToken });
        });

    } catch (error) {
        next(error);
    }
};

// ✅ Forgot Password - Step 1: Request OTP
export const forgotPassword = async (req, res, next) => {
    try {
        await authService.forgotPassword(req.body.email);
        res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        next(error);
    }
};

// ✅ Forgot Password - Step 2: Verify OTP
export const verifyOtp = async (req, res, next) => {
    try {
        const result = await authService.verifyOtp(req.body.email, req.body.otp);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// ✅ Forgot Password - Step 3: Reset Password
export const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;
        await authService.resetPassword(email, otp, newPassword);
        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        next(error);
    }
};
