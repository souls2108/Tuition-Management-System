import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler( async (req, res) => {
    const {displayName, email, phone, password} = req.body;

    if(!displayName || displayName?.trim() === "") {
        throw new ApiError(400, "Display Name is required.");
    }
    if(!email || email?.trim() === "") {
        throw new ApiError(400, "Email is required.");
    }
    if(!phone || phone?.trim() === "") {
        throw new ApiError(400, "Phone is required.");
    }
    if(!password || password?.trim() === "") {
        throw new ApiError(400, "Password is required.");
    }

   if(/^\d+$/.test(phone) === false) {
        throw new ApiError(400, "Phone number should contain digits.");
    }

    const existedUser = await User.findOne({
        $or: [{email},{phone}]
    });

    if(existedUser) {
        throw new ApiError(409, "User with credentials already exists.");
    }

    //TODO: Verify email OTP
    //TODO: Verify phone number OTP

    const user = await User.create({
        displayName: displayName,
        email: email,
        phone: phone,
        password: password
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    )
}
);




export {
    registerUser
}