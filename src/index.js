import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env',
})

const port = process.env.PORT || 8000;

connectDB()
.then( () => {
    try {
        app.on("error", (error) => {
            console.error("-> EXPRESS ERROR: ", error);
            throw error;
        });
        app.listen(port, () => {
            console.log(`-> App listening at port : ${port}`);
        });
        
    } catch (error) {
        console.error("EXPRESS ERROR: ", error);
        throw err;
    }
})
.catch((err) => {
    console.log("MONGO DB connection failed.");
});