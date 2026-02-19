import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// ✅ Authentication Middleware
export const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_TOKEN);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
};

// ✅ Generic Authorization Middleware
export const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied. Insufficient permissions." });
        }
        next();
    };
};

// ✅ Specialized Role Middleware
export const isSuperAdmin = authorize(["superAdmin"]);
export const isSalesTL = authorize(["sales_tl"]);
export const isSalesMember = authorize(["sales_member"]);
export const isSalesAdmin = authorize(["sales_admin"]);
export const isOperationTL = authorize(["operation_tl"]);
export const isOperationMember = authorize(["operation_member"]);
export const isOperationAdmin = authorize(["operation_admin"]);

// ✅ Helper for Multiple Roles (e.g., Sales Team)
export const isSalesTeam = authorize(["superAdmin", "sales_admin", "sales_tl", "sales_member"]);
export const isOperationTeam = authorize(["superAdmin", "operation_admin", "operation_tl", "operation_member"]);

// ✅ Helper for User Management (CRUD)
export const canManageUsers = authorize(["superAdmin", "sales_admin", "operation_admin"]);

// ✅ Helper for Project Deletion
export const canDeleteProject = authorize(["superAdmin", "sales_admin"]);
