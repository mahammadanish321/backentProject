// import express and other necessary modules routes is defined here
import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js"; //importing registerUser controller function
import { upload } from '../middlewares/multer.middleware.js' //importing multer upload middleware for handling file uploads



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
    registerUser);


// Exporting the router to be used in other parts of the application
export default router;
