import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

import path from "path";
const __dirname = path.resolve(path.dirname(''));
const static_path = path.join( __dirname,"./scripts/client/public");


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json({limit: "30kb"}))
app.use(express.urlencoded({extended: true, limit: "30kb"}))
app.use(express.static(static_path)) //frontend directory
app.use(express.static("public")) //temp
app.use(cookieParser())

import userRouter from "./server/routes/user.routes.js";
import homeRoutes from "./server/routes/homepage.routes.js"

app.use(homeRoutes)

app.use("/api/user", userRouter)




export {app}