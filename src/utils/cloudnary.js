import { v2 as cloudnary } from 'cloudinary';//cloudnary v2 version import for uploading images and videos etc
import fs from 'fs'; //file system module to handle file operations like deleting files etc this is not need to downlode because this is inbuilt module in node js.




//configure cloudnary with credentials from environment variables
cloudnary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});






//declear a variebe(uploadOncloudnary) to upload file on cloudnary and it is an async function because uploading process takes time so we use async await to handle the asynchronous nature of the operation
//and localFilePath is the path of the file to be uploaded on cloudnary
const uploadOnCloudinary = async (localFilePath) => {
    try {
        //check if localFilePath is available or not !
        if (!localFilePath) {
            throw new Error("File path is required"); //if not available throw an error
        }
        //hear we are using cloudnary uploader method to upload the file to cloudnary
        const response = await cloudnary.uploader.upload(localFilePath, {
            resource_type: "auto", //auto detect the file type(image,video etc)
        }); //if uplode successfull then it returns the response object containing details about the uploaded file
        console.log("Cloudinary upload result:", response.url);
        return response;
    }
    
    
    catch (error) {
        // console.error("Cloudinary upload error:", error);           //log the error if any occurs during the upload process

        //delete the file from local storage if any error occurs during upload
        fs.unlinkSync(localFilePath); //delete the file from local storage
        return null;
    }
};






//example usage of uploadOnCloudinary function
// Note: This is just for demonstration purposes. In a real application, you would call this function with the actual file path you want to upload.


/*
cloudnary.v2.uploader.upload("path/to/my/image.jpg", { public_id: "sample_id" },
    function (error, result) {

        console.log(result);
    });

*/





export { uploadOnCloudinary };