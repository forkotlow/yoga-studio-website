import jwt from "jsonwebtoken";
import asyncHandler from "../utility/asyncHandler.js";

import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";

import { uploadOnCloudinary } from "../utility/cloudinary.js";

import { User, Membership } from "../models/user.models.js";


const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        //console.log("USER _ID: ", user)
        
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating Referesh and access token")
    }
}

/*
const registerUser = asyncHandler( async(req,res) => {
    res.status(200).json({  message:"ok"  })
} )

*/

const registerUser = asyncHandler( async(req, res) => {
     
    const {fullName, email, password , avatarImage} = req.body
    console.log("email: ", email);

    if (
        [email, fullName, password, avatarImage].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({email})  //verifying if user exists in the database with same email

    if (existedUser) {
        throw new ApiError(409, "User with email already exists")
    }

    const avatarLocalPath = req.files?.avatarImage[0]?.path;

    //console.log(avatarLocalPath);

    if (!avatarLocalPath) {
        throw new ApiError(401, "Avatar file is 1 required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   

    const user = await User.create({
        fullName,
        avatarImage: avatar,
        email, 
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -address -contactNumber -gender -membershipDetails"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send back cookie

    const {email, password} = req.body

    console.log( req.body );
    

    if(!email){
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({email}) //check email in database
    
    if (!user) {
        throw new ApiError(404, "User does not exist")
    }else{
        console.log("this user exists");
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Password")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // removes the field if value is 1 from database
            }
        },
        { new: true }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized user request")
    }

    try {
        const decodedRefreshToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedRefreshToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const getCurrentUser = asyncHandler(async(req, res) => {
    
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, gender, address, contactNumber} = req.body
    
    if (!address || !contactNumber || !fullName || !gender) {
        throw new ApiError(400, "Required fields are empty")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName:fullName,
                address,
                gender,
                contactNumber: contactNumber
            }
        },
        {new: true}
        
    ).select("-password -refreshToken -membershipDetails")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const addCurrentMembershipToUser = asyncHandler( async(req,res)=> {
    
    const userID = req.user._id
    
    console.log("\n\nmembership userid:",userID);

    const user = await User.findById(userID)
    if(!user) {throw new ApiError(500,"User is invalid.")}

    const check = await user.checkMembership()

    console.log("has membership: ",check);
    
    if(!check){

        const { membershipName, membershipDuration, joinedAt, expiresAt} = req.body
    
        if (!membershipName || !membershipDuration ) {
            throw new ApiError(400, "Required fields are empty")
        }
    
        const membership = await Membership.create({
            membershipName,
            membershipDuration,
            joinedAt, 
            expiresAt,
        })
    
        if (!membership) {
            throw new ApiError(500, "Something went wrong while adding membership to user the user")
        }
    
        return res
        .status(200)
        .json(new ApiResponse(200, membership, "membership status updated successfully"))
    
     }
     else{
        throw new ApiError(500,"user already has a membership ")
     }
    
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    updateAccountDetails,
    getCurrentUser,
    addCurrentMembershipToUser
}