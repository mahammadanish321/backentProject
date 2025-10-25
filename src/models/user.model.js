import mongoose, { Schema } from "mongoose"; //import mongoose because we are using mongoose to create schema and model
import bcrypt from "bcrypt"; //this is for hashing password that why import bcrypt
import jwt from "jsonwebtoken"; //this is for generating token for authentication purpose


//create user schema models
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email:
        {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,


        },
        fullName:
        {
            type: String,
            required: true,
            trim: true,
            trim: true,
            index: true,
        },
        avatar:
        {
            type: String, //URL of cloudinary image
            required: true,

        },
        coverImage:
        {
            type: String, //URL of cloudinary image

        },
        watchHistory:
            [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Video",
                }
            ],
        password:
        {
            type: String,
            required: [true, "password is required"],
        },
        refreshToken:
        {
            type: String,
        },

    },
    { timestamps: true }
)




//hash(encrypting password) password before saving user document
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); //if password is not modified then skip hashing

    this.password = await bcrypt.hash(this.password, 10); //hash the password with salt rounds 10
    next(); //call next middleware
});



//method to compare password for login
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);   //compare the plain password with hashed password
}


//method to generate access token and refresh token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
        id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
        }
    )
}


//method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
        id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
        }
    )
}

//create user model and export it
export const User = mongoose.model("User", userSchema);