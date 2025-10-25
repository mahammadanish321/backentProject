import { asyncHandler } from '../utils/asyncHandler.js'; //importing asyncHandler utility function to handle asynchronous operations in route handlers 
import { ApiError } from '../utils/ApiError.js'; //importing ApiError class for consistent API error handling
import { User } from '../models/user.model.js'; //importing User model to interact with user data in the database
import { uploadOnCloudinary } from '../utils/cloudnary.js'; //importing uploadOnCloudinary function to handle file uploads to Cloudinary
import { ApiResponce } from '../utils/ApiResponce.js'; //importing ApiResponce class for standardized API responses







// Controller function to handle user registration (registerUser exsample)
const registerUser = asyncHandler(async (req, res) => {
    //get user data from frontend
    //validate-not empty
    //check if user already exists : username
    //chack for image, check for avatar
    //upload image to cloudinary,avatar
    //creat user object - create in db
    //remove password and refresh token fields from response
    //chack for user creation
    //return res

    const { fullName, email, username, password } = req.body;
    // console.log("email:", email);
    // console.log("password:", password);

    if (fullName === "") {
        throw new ApiError(400, "Full name is required");
    }
    if (password.length < 6 || password.length > 20 || password.length === 0 || password === "") {
        throw new ApiError(400, "password not in format");
    }
    if (username === "") {
        throw new ApiError(400, "username is required");
    }
    if (email === "" || email.length === 0 || !email || !email.includes("@")) {
        throw new ApiError(400, "email is required and cheak format");
    }
    const existingUser = User.findOne({ $or: [{ email: email }, { username: username }] })
    if (existingUser) {
        throw new ApiError(409, "User already exists with given email or username");
    }


    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Failed to upload avatar image");
    }

    const user = await User.create({
        fullName,
        email: avatar.url,
        coverImage: coverImage.url || "",
        username,
        password,
        email,
    })


    const createdUser = await User.findByIdAndUpdate(user._id).select("-password -refreshToken");


    if (!createdUser) {
        throw new ApiError(500, "something went wrong while creating user");
    }

    return res.status(201).json(
        new ApiResponce(201, createdUser, "User registered successfully"));


})
















// Exporting the registerUser controller function for use in other modules
export { registerUser }
