import Router from "express";
import { verifyJWT } from "../../middlewares/auth.middleware";

const router = new Router();

router.use(verifyJWT);

import { userInstituteRequestRouter } from "./userInstituteRequest.routes.js";

router.use("/userInstituteRequest", userInstituteRequestRouter);
rou

export default router;