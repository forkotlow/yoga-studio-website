import dotenv from "dotenv"
import connectDB from "./server/db/connectDb.js";
import { app } from "./app.js";

dotenv.config({ path: './env' })

connectDB().then( () => {
        app.listen(process.env.PORT || 8080)
        console.log("Server is Running Successfully,\nListening on Port:" , process.env.PORT)
    }).catch( (error) => {
        console.error("\n\n ## Connection to MongoDB...FAILED")
})


    