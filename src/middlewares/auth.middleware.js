import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        console.log("Token received:", token); // Debug log
    
        if (!token) {
            throw new ApiError(401, "Unauthorized request - No token provided")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log("Decoded token:", decodedToken); // Debug log
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if (!user) {
            throw new ApiError(401, "Invalid token - User not found")
        }
    
        req.user = user;
        next();
    } catch (error) {
        // More specific error messages
        if (error.name === 'JsonWebTokenError') {
            throw new ApiError(401, "Invalid token format")
        }
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, "Token has expired")
        }
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})
