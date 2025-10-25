import express from "express" //importing express module (1)
import cors from "cors" //importing cors module to handle cross-origin requests
import cookieparser from "cookie-parser" //importing cookie-parser module to parse cookies from incoming requests




const app = express() //creating express application instance (2)


//configuring cors middleware to allow requests from specified origin with credentials support
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Allow requests from this origin (not all origins are allowed for security reasons which write in .env file)
    credentials:true,
}))


//data handling middlewares || app.use is configuring middleware functions for the express app
app.use(express.json({limit:"16kb"})) //to parse incoming JSON requests with a size limit of 16kb
app.use(express.urlencoded({extended:true, limit:"16kb"})) //to parse URL-encoded data with extended syntax and a size limit of 16kb
app.use(express.static("public")) //to serve static files from the "public" directory
app.use(cookieparser()) //to parse cookies from incoming requests




// important  for main URL encoded data handling

//routes implement
import userRoutes from "./routes/user.routes.js" //importing user routes module
//routes declaration
app.use("/api/v1/users", userRoutes) //mounting user routes at /api/v1/users path





export{ app } //exporting the app instance (3)