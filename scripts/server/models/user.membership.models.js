import mongoose, { Schema } from "mongoose";
import { ApiError } from "../utility/ApiError";


const membershipInfoSchema = new mongoose.Schema({

    isMember:{
        type: Boolean, 
        required:true
    },
    memberEmail: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    membershipName: {
        type: String,
    },
    membershipDuration: {
        type: number,
        min: 1,
        max: 12
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: " "
    }
    
})

membershipInfoSchema.methods.getExpireyDate = async function() {
        try {
            const joinedAtDate = new Date(this.joinedAt)
            const expiresAtDate = new joinedAtDate.setMonth(creationDate.getMonth() + this.membershipDuration)
            
            return expiresAtDate
        } catch (error) {
            throw new ApiError(500, "membership expirey date creation failed")
        }
}

/*
        function() {
          const creationDate = new Date(this.createdAt);
          return new Date(creationDate.setMonth(creationDate.getMonth() + 6));
    
*/


export const User = mongoose.model("membershipinfo",membershipInfoSchema)