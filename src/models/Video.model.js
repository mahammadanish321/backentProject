import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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
        type:Number,//in seconds and cloudinary provide it
        required:true,
    },
    views:{
        type:Number,
        default:0,
    },
    isPublished:{
        type:Boolean,
        default:false,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },

}, 
{timestamps: true}
);


videoSchema.plugin(mongooseAggregatePaginate);//for pagination 

export const Video = mongoose.model("Video", videoSchema);