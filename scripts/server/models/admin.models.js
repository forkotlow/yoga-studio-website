import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        default: "admin",
        require: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    }
})

adminSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next() 
    else{
        this.password = await bcrypt.hash( this.password, 10 ) //encrypts password before saving into database
        next()
    }
})

adminSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password , this.password) //returns boolean
}

adminSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}

adminSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Admin = mongoose.model("Admin", adminSchema)