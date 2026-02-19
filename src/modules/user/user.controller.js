import * as userService from "./user.service.js";

// ✅ Get All Users
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAll();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

// ✅ Get User By ID
export const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// ✅ Create User (Admin Only)
export const createUser = async (req, res, next) => {
    try {
        const user = await userService.create(req.body);
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        next(error);
    }
};

// ✅ Update User (Admin Only)
export const updateUser = async (req, res, next) => {
    try {
        const user = await userService.update(req.params.id, req.body);
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        next(error);
    }
};

// ✅ Delete User (Admin Only)
export const deleteUser = async (req, res, next) => {
    try {
        await userService.remove(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
};
