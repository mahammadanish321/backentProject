//This middleware manly for handaling the logout type(user access needed but we dont want to take that) oparation becsuse when useer try to logout obbesly he dont fill any form for logouting but if he dont fill any form then how we access him databace ?
//for that spasafis resion use this middleware 

import { ApiError } from "../utils/ApiError.js"; //for handaling error
import { asyncHandler } from "../utils/asyncHandler.js"; //for handaling async
import jwt from "jsonwebtoken";  //importing for verifin token
import {User} from "../models/user.model.js"; // using user method 

// hear the export and methort decleartion at same time 
//the methord called verifJWT and its a middleware its take a request and do some work and give it to the next.
export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        // the varible token he asked for the access token it can be provided by cookis or header (form login) 
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        // console.log("Token received:", token); // Debug log
         //if token avelable this stape will pass
        if (!token) {
            throw new ApiError(401, "Unauthorized request - No token provided")
        }
        
        // hear decode the user access token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
        // console.log("Decoded token:", decodedToken); // Debug log
        
        // by user dcoded access token find the user for currect persion logout 
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken") //unselect the password and refreshtoken becuse we dont need thad in this point 


        //if user not found by his access token then throw an error 
        if (!user) {
            throw new ApiError(401, "Invalid token - User not found")
        }
         
        req.user = user;
        next(); //pass throw to next.
        
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
