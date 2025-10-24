import mongoose, {Schema} from "mongoose"; //import mongoose because we are using mongoose to create schema and model
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; //import mongoose aggregate paginate for pagination purpose


//create video schema models
const videoSchema = new Schema({
    
    videofile:{
        type:String,//cloudinary url
        required:true,
    },
    thumbnail:{
        type:String,//cloudinary url
        required:true,
    },
    
    titel:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    duration:{
        type:Number,// this is in seconds  and cloudinary provide it
        required:true,
    },
    views:{
        type:Number,
        default:0, //default views is 0
    },
    isPublished:{
        type:Boolean,
        default:false,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,//this is reference to user model
        ref:"User",
        required:true,
    },

}, 
{timestamps: true} //this will add createdAt and updatedAt fields automatically
);


videoSchema.plugin(mongooseAggregatePaginate);//for pagination purpose


//create video model and export it 
export const Video = mongoose.model("Video", videoSchema);