import { Router } from "express";
import { 
    changeCurrentPassword,
    deleteUser,
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    updateAccountDetails,
} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// open routes
/**
 * registerUser 
 * login 
 * getUserIdsByName 9
 * getUserProfile:_id 10
 */
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Secure routes
/**
 * logout 
 * refresh-token 
 * change-password 
 * current-user 
 * update-account 
 * change-password 
 * delete-user
 * 
 * /createEnrollmentRequest
 * /userEnrollmentRequests
 */
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/delete-user").delete(verifyJWT, deleteUser);

// TODO: GET USER TRANS


export default router;