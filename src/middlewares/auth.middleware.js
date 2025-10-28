import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js";



export const verifyJWT =asyncHandler(async(req,_,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
    
        if (!token){
            throw new ApiError(401,"Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
    
        const user=await  User.findById(decodedToken?._Id).select("-password -refreshToken")
        if (!user){
        // next video have a duction hear 
            throw new ApiError (401,"Unauthorized request - user not found")
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError (401,error?.message || "invalid access token")
    }
})