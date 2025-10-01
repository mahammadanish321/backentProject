// require ('dotenv').config({path:'./env'})
import dotenv from "dotenv";
// import mongoose from "mongoose";
// import {DB_NAME} from "./constants"

import connect from "./db/index.js";



dotenv.config({
    path:'./.env'
})

connect()





/*
import express from "express"
const app=express()

(async()=>{
    try {
        await mongoose.connect(`${prosses.env.MONGODB_URL}/${MONGODB_URL}`)
        app.on("error",(error)=>{
            console.log("ERROR",error);
        })
        throw error
    app.listen(process.env.PORT,()=>{
        console.log(`app listen on port:${process.env,PORT}`);
    })

    } catch (error) {
        console.error("ERROR",error)
    }
})()
*/