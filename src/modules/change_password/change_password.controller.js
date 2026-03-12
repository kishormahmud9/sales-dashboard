import * as changePasswordService from "./change_password.service.js";

export const changePasswordController = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const result = await changePasswordService.changePassword(req.user.id, currentPassword, newPassword);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
