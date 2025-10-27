import { asyncHandler } from '../utils/asyncHandler.js'; //importing asyncHandler utility function to handle asynchronous operations in route handlers 
import { ApiError } from '../utils/ApiError.js'; //importing ApiError class for consistent API error handling
import { User } from '../models/user.model.js'; //importing User model to interact with user data in the database
import { uploadOnCloudinary } from '../utils/cloudnary.js'; //importing uploadOnCloudinary function to handle file uploads to Cloudinary
import { ApiResponce } from '../utils/ApiResponce.js'; //importing ApiResponce class for standardized API responses



const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "sonthing went wrong while generating assess and refresh token")
    }
}



// Controller function to handle user registration (registerUser exsample)
const registerUser = asyncHandler(async (req, res) => {
    //algorithm
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
    if (!password || password.length < 6 || password.length > 20) {
        throw new ApiError(400, "Password not in valid format");
    }
    if (username === "") {
        throw new ApiError(400, "username is required");
    }
    if (!email || !email.includes("@")) {
        throw new ApiError(400, "email is required and cheak format");
    }


    //check if user already exists dependent on email and username in database
    const existingUser = await User.findOne({ $or: [{ email: email }, { username: username }] })
    if (existingUser) {
        throw new ApiError(409, "User already exists with given email or username");
    }

    // console.log("req.files:", req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path




    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }






    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar) {
        throw new ApiError(400, "Failed to upload avatar image");
    }

    let coverImage = null;
    if (coverImageLocalPath) {
        coverImage = await uploadOnCloudinary(coverImageLocalPath);
    }

    const user = await User.create({
        fullName,
        email,
        coverImage: coverImage?.url || "",
        avatar: avatar.url,
        username: username.toLowerCase(),
        password
    })

    //fetch the created user from db to remove password and refresh token fields from response 
    const createdUser = await User.findByIdAndUpdate(user._id).select("-password -refreshToken");


    if (!createdUser) {
        throw new ApiError(500, "something went wrong while creating user");
    }

    return res.status(201).json(
        new ApiResponce(201, createdUser, "User registered successfully"));


})




const loginUser = asyncHandler(async (req, res) => {


    // req body->data
    // user or email 
    // finde the user 
    // password check
    // access and refresh token 
    // send cookie


    const { email, username, password } = req.body;

    if (!username || !email) {
        throw new ApiError(400, "Username or email required")
    }

    const user = await User.findOne({

        $or: [{ username }, { email }]

    })

    if (!user) {
        throw new ApiError(404, "User not found")
    }





    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user password");
    }




    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).
        select("-passwoed -refreshToken")


    const option = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("accessatoken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponce(
                200, {
                user: loggedInUser, accessToken, refreshToken
            }, "Uer login succesfull"
            )
        )







})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined
        }
    }, { new: true })


    const option = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
   .clearCookie("accessatoken", option)
   .clearCookie("refreshToken", option)
   .json(
       new ApiResponce(200, {}, "User logged out successfully")
   )


})















// Exporting the registerUser controller function for use in other modules
export {
    registerUser,
    loginUser
}
