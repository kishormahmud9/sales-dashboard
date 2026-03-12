export const registerSchema = (data) => {
    const errors = [];
    if (!data.name) errors.push("Name is required");
    if (!data.email) errors.push("Email is required");
    if (!data.password || data.password.length < 6) errors.push("Password must be at least 6 characters");

    return errors.length > 0 ? { error: errors.join(", ") } : { error: null };
};

export const loginSchema = (data) => {
    const errors = [];
    if (!data.email) errors.push("Email is required");
    if (!data.password) errors.push("Password is required");

    return errors.length > 0 ? { error: errors.join(", ") } : { error: null };
};

export const forgotPasswordSchema = (data) => {
    const errors = [];
    if (!data.email) errors.push("Email is required");
    return errors.length > 0 ? { error: errors.join(", ") } : { error: null };
};

export const verifyOtpSchema = (data) => {
    const errors = [];
    if (!data.email) errors.push("Email is required");
    if (!data.otp) errors.push("OTP is required");
    return errors.length > 0 ? { error: errors.join(", ") } : { error: null };
};

export const resetPasswordSchema = (data) => {
    const errors = [];
    if (!data.email) errors.push("Email is required");
    if (!data.otp) errors.push("OTP is required");
    if (!data.newPassword || data.newPassword.length < 6) errors.push("New password must be at least 6 characters");
    return errors.length > 0 ? { error: errors.join(", ") } : { error: null };
};
