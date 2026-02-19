export const createUserSchema = (data) => {
    const errors = [];
    if (!data.name) errors.push("Name is required");
    if (!data.email) errors.push("Email is required");
    if (!data.password) errors.push("Password is required");
    return errors.length > 0 ? { error: errors.join(", ") } : { error: null };
};

export const updateUserSchema = (data) => {
    const errors = [];
    // Potentially no required fields for update, or just one
    if (Object.keys(data).length === 0) errors.push("At least one field must be provided for update");
    return errors.length > 0 ? { error: errors.join(", ") } : { error: null };
};
