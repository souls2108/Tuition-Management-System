import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async(userId) => {
    try{
        const user = await User.findById(userId);
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
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials.");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken( user._id);

    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            loggedInUser,
            "User logged In successfully"
        )
    );
});

const logoutUser = asyncHandler( async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: true,
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
})

const refreshAccessToken = asyncHandler( async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request");
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);
        if(!user) {
            throw new ApiError(401, "Invalid refresh token.");
        }
        if(incomingRefreshToken != user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: true,
        };

        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {}, "Access Token refreshed.")
        )

    } catch (error) {
        throw new ApiError(401, error?.message 
            || "Invalid refresh token");
    }
})



export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}