import { asyncHandler } from '../utils/asyncHandler.js'; //importing asyncHandler utility function to handle asynchronous operations in route handlers 
import { ApiError } from '../utils/ApiError.js'; //importing ApiError class for consistent API error handling
import { User } from '../models/user.model.js'; //importing User model to interact with user data in the database
import { uploadOnCloudinary } from '../utils/cloudnary.js'; //importing uploadOnCloudinary function to handle file uploads to Cloudinary
import { ApiResponce } from '../utils/ApiResponce.js'; //importing ApiResponce class for standardized API responses
import jwt from "jsonwebtoken";  //importing for verifin token








// function to generate access and refresh token and save refresh token in db
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken() // the method (generateAccessToken()) from user model 
        const refreshToken = user.generateRefreshToken() //method (....()) from user model 


        //save refresh token in db
        user.refreshToken = refreshToken
        user.save({ validateBeforeSave: false }); //validateBeforeSave becuse when we try to save the rejreshTolen in user model we requard the password but hear we dont have password so we do this. that mean it will be save before validate without password. 

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "sonthing went wrong while generating assess and refresh token")
    }
}















// Controller function to handle user registration
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


















// controller function to handle user login
const loginUser = asyncHandler(async (req, res) => {


    // req body->data
    // user or email 
    // finde the user 
    // password check
    // access and refresh token 
    // send cookie


    const { email, username, password } = req.body;



    // this is to check if either username or email is provided in the request body. If neither is provided, it throws an ApiError with a 400 status code and a message indicating that either username or email is required.
    if (!(username || email)) {
        throw new ApiError(400, "Username or email required")
    }
    // Finding a user in the database whose username or email matches the provided username or email from the request body.
    const user = await User.findOne({

        $or: [{ username }, { email }] //this is used to perform a logical OR operation in MongoDB queries. It allows you to specify multiple conditions, and if any of those conditions are met, the document will be considered a match.

    })
    // now hare we are checking if the user is found in the database based on the provided username or email. If no user is found (i.e., the user variable is null or undefined), it throws an ApiError with a 404 status code and a message indicating that the user was not found.
    if (!user) {
        throw new ApiError(404, "User not found")
    }




    // here we are validating the provided password against the stored password for the found user. It uses the isPasswordCorrect method (which is assumed to be defined in the User model) to check if the provided password matches the stored password. If the password is incorrect, it throws an ApiError with a 401 status code and a message indicating that the user password is invalid.
    const isPasswordValid = await user.isPasswordCorrect(password);
    // now the verible isPasswordValid will be true if the password is correct, and false otherwise.
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user password");
    }



    // this is so important part of code
    // here we are generating access and refresh tokens for the authenticated user by calling the generateAccessAndRefreshToken function, passing the user's unique identifier (user._id) as an argument. This function is expected to return an object containing both the access token and refresh token.

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).
        select("-password -refreshToken")

    //this is cookis sending by object 
    const option = {
        httpOnly: true, //only modyfi by server
        secure: true
    }

    // explanation of below code : basicly the code is responsible for sending a successful login response to the client, including setting cookies for access and refresh tokens.
    // setting the cookies for access and refresh tokens
    return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponce(
                200, {
                user: loggedInUser, accessToken, refreshToken //sending the logged in user data along with access and refresh token in response body
            }, "Uer login succesfull"
            )
        )







})


























// controller function to handle user logout
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined // Clear the refresh token on logout because user is logging out when user log out system should not allow to generate new access token using old refresh token also remove the refresh token from db
        }
    }, { new: true }) //it is used to return the updated document after the update operation is performed.

    //option to return the updated document
    const option = {
        httpOnly: true, //it helps to mitigate the risk of client-side script accessing the protected cookie data
        secure: true, //it ensures that the cookie is only sent over secure HTTPS connections, enhancing the security of the cookie during transmission
    }
    // it clears the "accessatoken" and "refreshToken" cookies from the client's browser and sends a JSON response indicating that the user has been logged out successfully.
    return res.status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(
            new ApiResponce(200, {}, "User logged out successfully") //indicates successful logout
        )


})










//this controll is for stay login when user assess token is expaiard. wher we update the user access token using his refreash token which is store in cookies or user body.
//algritham
//
const refreshAccessToken = asyncHandler(async (req, res) => {

    //
    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken //take the refreshToken form either cookie or body.


    //if incoming token is not avalable then throw a error 
    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorize request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        console.log("Decoded token:", decodedToken); // Debug log


        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "invalid user")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "refreash token is expaieard or used")
        }

        const option = {
            httpOnly: true,
            secure: true
        }

        const { newRefreshToken, accessToken } = await generateAccessAndRefreshToken(user._id)

        res.body
            .status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", newRefreshToken, option)
            .json(
                new ApiResponce(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token is refresheed succesfully"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refrace token")
    }





})


//password changing algrothem 
// .declear the variables (old,new,conform)
// .chack the old password is correct or not by accassing the old password
// .chack the the old one and the new one is same or not ? is same throw the error 
// .also chack the the new and conform is same or not is same then ok 
// .if every thing is ok then push the new password in user password












// Exporting the registerUser, loginUser and logoutUser controller function for use in other modules
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken

}
