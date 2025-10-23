import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
        fullname:
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





userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});




userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}



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


export const User = mongoose.model("User", userSchema);