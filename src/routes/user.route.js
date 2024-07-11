import { Router } from "express";
import {

} from "../controllers/user.controller.js"


const router = Router();

// open routes
/**
 * registerUser 1
 * login 2
 * getUserIdsByName 9
 * getUserProfile:_id 10
 */

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

// router.router("/register").post(registerUser);

export default router;