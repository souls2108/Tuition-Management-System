import { User } from "../../models/user.model.js";

const getById = async (userId) => {
    const user = await User.findById(userId, {password: 0, refreshToken: 0});
    return user;
}

const UserService = {
    getById,
}

export {
    UserService
}