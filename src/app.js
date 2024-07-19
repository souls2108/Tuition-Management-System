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
//routes declaration
app.use("/api/users", userRouter);
app.use("/api/institute", instituteRouter);
app.use("/api/r", userInstituteRequestRouter);
app.use("/api/e", employeeRouter)

export { app };