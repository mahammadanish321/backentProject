//import and configure dotenv to manage environment variables and load variables from .env file
//inport connectDB function to establish a connection to MongoDB
//import express to create an Express application
//(altaranative code) require ('dotenv').config({path:'./env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";


//this is required to read .env file and set the environment variables when we avoid alternative code and make sure to change type to module in package.json
dotenv.config({
    path: './.env'
});




// Port to listen on (app instance is imported from ./app.js)
const port = process.env.PORT || 8000; // Use the PORT from environment variables or default to 8000


// Connect to MongoDB which is imported from db/index.js file
connectDB()




//this part not required to connect DB seprately as we are connecting DB using connectDB function above

//then() method is used to handle the successful connection and catch() method to handle any errors during the connection process.
    .then(() => {
        // Start server only after DB connection is established
        // Listening on specified port
        app.listen(port, () => {
            console.log(`\nServer is running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed!", err);
        process.exit(1);
    });
























/*
import express from "express"
const app=express()

(async()=>{
    try {
        await mongoose.connect(`${prosses.env.MONGODB_URL}/${MONGODB_URL}`)
        app.on("error",(error)=>{
            console.log("ERROR",error);
            throw error
        })
        
    app.listen(process.env.PORT,()=>{
        console.log(`app listen on port:${process.env,PORT}`);
    })

    } catch (error) {
        console.error("ERROR",error)
    }
})()
*/