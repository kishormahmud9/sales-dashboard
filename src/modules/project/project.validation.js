export const createProjectSchema = (data) => {
    const errors = [];

    if (!data.profileName) errors.push("profileName is required");
    if (!data.clientName) errors.push("clientName is required");
    if (!data.source) errors.push("source is required");
    if (!data.serviceLine) errors.push("serviceLine is required");
    if (!data.country) errors.push("country is required");
    if (!data.quote) errors.push("quote is required");
    if (!data.queryStatus) errors.push("queryStatus is required");
    if (!data.conversationStatus) errors.push("conversationStatus is required");
    // soldById is now optional

    // Follow-up Status (Optional but should be booleans)
    if (data.f01 !== undefined && typeof data.f01 !== "boolean") errors.push("f01 must be a boolean");
    if (data.f02 !== undefined && typeof data.f02 !== "boolean") errors.push("f02 must be a boolean");
    if (data.f03 !== undefined && typeof data.f03 !== "boolean") errors.push("f03 must be a boolean");

    return errors.length > 0 ? { error: errors.join(", ") } : { error: null };
};
