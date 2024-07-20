import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());


//routes import
import userRouter from './routes/user.routes.js'
import instituteRouter from './routes/institute.routes.js';
import userInstituteRequestRouter from "./routes/userInstitute.routes.js"
import employeeRouter from "./routes/employee.routes.js"
import admissionRouter from "./routes/admission.routes.js";
import enrollRequestRouter from "./routes/enrollmentRequest.routes.js"
import courseRouter from "./routes/course.routes.js"
import sessionRouter from "./routes/session.routes.js"
//routes declaration
app.use("/api/users", userRouter);
app.use("/api/institute", instituteRouter);
app.use("/api/r", userInstituteRequestRouter);

//move to institute router
app.use("/api/e", employeeRouter);
app.use("/api/a", admissionRouter);
app.use("/api/enroll-request", enrollRequestRouter);
app.use("/api/c", courseRouter)
app.use("/api/s", sessionRouter)

export { app };