import mongoose, { Schema } from "mongoose";

const membershipInfoSchema = new mongoose.Schema({

    membershipName: {
        type: String,
        required: true
    },
    membershipDescription: {
        type: String,
        required: true
    },
    instructorName: {
        type: String,
        required: true
    },
    membershipDuration: {
        type: Number,
        required: true
    },
    
})


export const User = mongoose.model("adminMembership",membershipInfoSchema)