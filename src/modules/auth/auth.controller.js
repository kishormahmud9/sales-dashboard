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
            if (err) throw new DevBuildError("Invalid refresh token", 403);

            const accessToken = jwt.sign(
                { id: decoded.id },
                process.env.JWT_SECRET_TOKEN,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.status(200).json({ accessToken });
        });

    } catch (error) {
        next(error);
    }
};
