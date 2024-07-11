import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken = async(user) => {
    try{
        if(!user) { 
            console.log("Extra DB call");
            user = await User.findById(userId);
        } else {
            console.log("No DB call");
        }
        const accessToken =  user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        
        return {accessToken, refreshToken};
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token.");
    }
}

const registerUser = asyncHandler( async (req, res) => {
    const {displayName, email, phone, password} = req.body;

    // input validation
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

const loginUser = asyncHandler( async (req, res) => {
    const {email, phone, password} = req.body;
    console.log(email, phone, password, "\n\n");
    if(!email && !phone) {
        throw new ApiError(400, "Email or Phone number is required.");
    }

    if(!password) {
        throw new ApiError(400, "Password is required.");
    }

    const user = await User.findOne(
        {
            $or: [{email}, {phone}]
        }
    );

    if(!user) {
        throw new ApiError(404, "User not found.");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials.");
    }

    const {accessToken, refreshToken} = generateAccessAndRefreshToken( user);

    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res.status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken)
    .json(
        new ApiResponse(
            200,
            loggedInUser,
            "User logged In successfully"
        )
    );
});





export {
    registerUser,
    loginUser,
}