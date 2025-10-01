import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const conectionINstionce = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\n Mongo DB conneceted !! DB HOST:${conectionINstionce.connection.host}`)
    } catch (error) {
        console.log("mongo DB connection feald", error);
        process.exit(1)
    }
}

export default connectDB