import { Router } from "express";
import {

} from "../controllers/user.controller.js"


const router = Router();

// open routes
/**
 * registerUser
 * login
 * getUserIdsByName
 * getUserProfile:_id
 */

// Secure routes
/**
 * logout
 * refresh-token
 * change-password
 * current-user
 * update-account
 * change-password
 * 
 * /i/:institutename
 * /createInstituteRequest
 * /userInstituteRequests
 * 
 * /createEnrollmentRequest
 * /userEnrollmentRequests
 */

// router.router("/register").post(registerUser);

export default router;