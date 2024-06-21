import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


const membershipInfoSchema = new mongoose.Schema({    
    membershipName: {
    type: String,
    },
    membershipDuration: {
        type: Number,
        min: 1,
        max: 12
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: function() {
        // Calculate the expiration date based on the joinedAt date and a duration
        const creationDate = new Date(this.joinedAt);
        return new Date(creationDate.setMonth(creationDate.getMonth() + this.membershipDuration)); }
    }
})
    

export const Membership = mongoose.model("membershipinfo", membershipInfoSchema)


const userSchema = new mongoose.Schema({

    avatarImage:{
        type: String, //url from cloudinary
        required:true
    },
    fullName: {
        type: String,
        require: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    membershipDetails: {
        type: Schema.Types.ObjectId,
        ref: "membershipinfo"
    },
    address: {
        type: String,
        lowercase: true
    },  
    contactNumber: {
        type: Number
    },
    gender: {
        type: String,
        enum: ["male","female","other" ],
        default: "male"
    },
    refreshToken: {
        type: String
    }

}, {timestamps: true })

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next() 
    else{
        this.password = await bcrypt.hash( this.password, 10 ) //encrypts password before saving into database
        next()
    }
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password , this.password) //returns boolean
}

userSchema.methods.checkMembership = async function(userId) {
    // Function to check if a user is a member
    //const user = await User.findById(userId).populate('membershipinfos');
    const user = await User.findOne({ 'membershipinfos': membershipId });  
    return user !== null ; // Returns true if membership exists, false otherwise
  
}

userSchema.methods.generateAccessToken = function(){
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

userSchema.methods.generateRefreshToken = function(){
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

export const User = mongoose.model("User",userSchema)

