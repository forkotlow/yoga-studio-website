import jwt from "jsonwebtoken";
import asyncHandler from "../utility/asyncHandler.js";

import { Admin } from "../models/admin.models.js";

const registerAdmin = asyncHandler( async(req, res) => {
     
    const {username, password} = req.body
    //console.log("email: ", email);

    if (
        [userame, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({username})  //verifying if user exists in the database with same email

    if (existedUser) {
        throw new ApiError(409, "User with email already exists")
    }

    const user = await Admin.create({
        username,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "Admin registered Successfully")
    )

})

const loginAdmin = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send back cookie

    const {username, password} = req.body

    console.log( req.body );
    

    if(!username){
        throw new ApiError(400, "username or email is required")
    }

    const user = await Admin.findOne({username}) //check admin username in database
    
    if (!user) {
        throw new ApiError(404, "Admin does not exist")
    }else{
        console.log("this admin exists");
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


export {registerAdmin , loginAdmin}

