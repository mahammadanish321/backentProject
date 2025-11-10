// import express and other necessary modules routes is defined here
import { Router } from "express";
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  refreshAccessToken, 
  changeCurrentPassword, 
  getCurrentUesr, 
  updateAccountDetails, 
  updateUsrAvatar, 
  updateUsrCoverImage, 
  getUserChannelProfile, 
  getWatchHistory 
} from "../controllers/user.controller.js"; //importing registerUser controller function
import { upload } from '../middlewares/multer.middleware.js' //importing multer upload middleware for handling file uploads
import { verifyJWT } from "../middlewares/auth.middleware.js";




// Creating a new router instance for user-related routes 
const router = Router();
// Defining route for user registration at /register endpoint
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1
    }, //field name avatar for single file
    {
      name: "coverImage",
      maxCount: 1
    } //field name coverImage for single file
  ]),
  registerUser)

router.route("/login").post(upload.none(), loginUser)
//verifyJWT is the middleware which import form auth.middleware.js
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUesr)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUsrAvatar)
router.route("/cover-image").patch(verifyJWT,upload.single("/coverImage"),updateUsrCoverImage)
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory)


// Exporting the router to be used in other parts of the application
export default router;
