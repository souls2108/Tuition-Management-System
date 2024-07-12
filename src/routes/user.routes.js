import { Router } from "express";
import { 
    loginUser,
    logoutUser,
    registerUser,
} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// open routes
/**
 * registerUser 1
 * login 2
 * getUserIdsByName 9
 * getUserProfile:_id 10
 */
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Secure routes
/**
 * logout 4
 * refresh-token 3
 * change-password 5
 * current-user 6
 * update-account 7
 * change-password 8
 * delete-user
 * 
 * /createEnrollmentRequest
 * /userEnrollmentRequests
 */
router.route("/logout").post(verifyJWT, logoutUser);

// router.router("/register").post(registerUser);

export default router;