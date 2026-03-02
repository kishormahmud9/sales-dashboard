export const createProjectSchema = (data) => {
    const errors = [];

    // All fields are now optional
    // soldById is now optional

    // Follow-up Status (Optional but should be booleans)
    if (data.f01 !== undefined && typeof data.f01 !== "boolean") errors.push("f01 must be a boolean");
    if (data.f02 !== undefined && typeof data.f02 !== "boolean") errors.push("f02 must be a boolean");
    if (data.f03 !== undefined && typeof data.f03 !== "boolean") errors.push("f03 must be a boolean");

    return errors.length > 0 ? { error: errors.join(", ") } : { error: null };
};
