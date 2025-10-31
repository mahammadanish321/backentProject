import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({

subscriber:{
    type:mongoose.Schema.Types.ObjectId, //One who is subscribing
    ref:"User"

},

channel:{
    type:mongoose.Schema.Types.ObjectId, //One who is subscribing
    ref:"User"
}
},{timestamps:true})







export const subscription =mongoose.model("Subscription",subscriptionSchema);