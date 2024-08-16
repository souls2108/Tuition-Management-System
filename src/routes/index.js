import { Router } from "express";

const router = Router({mergeParams: true});

import userRouter from "./users/user.routes.js";
import userDetailsRouter from "./user-details/index.js";
import instituteRouter from "./institutes/index.js";

router.use("/users", userRouter);
router.use("/user-details", userDetailsRouter);
router.use("/institute", instituteRouter);

export default router;