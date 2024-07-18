import { User } from "../../models/user.model";

const getUserById = async (userId) => {
    const user = await User.findById(userId, {password: 0, refreshToken: 0});
    return user;
}

const UserService = {
    getUserById,
}

export {
    UserService
}