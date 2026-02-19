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
    if (!data.soldById) errors.push("soldById is required");

    return errors.length > 0 ? { error: errors.join(", ") } : { error: null };
};
