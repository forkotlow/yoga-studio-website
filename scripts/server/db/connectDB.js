import mongoose from "mongoose";

const connectDB = async() => 
    {
        try {
            const connectionInstance = await mongoose.connect(process.env.MONGODB_DATABASE_URL+'/'+process.env.MONGODB_DATABASE_NAME)
            console.log( "\nConnection To MongoDB Established Successfully")
        } catch (error) {
            console.log("Connection To MongoDB Failed.", error)
            process.exit(1)
        }

    }

export default connectDB 