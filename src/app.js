import express from "express" //1
import cors from "cors"
import cookieparser from "cookie-parser"



const app = express() //2


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true,
}))


app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"})
)
app.use(express.static("public"))
app.use(cookieparser())


export{ app } //3