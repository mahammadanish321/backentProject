import multer from "multer"; // Importing multer for handling file uploads in local server



//configuring storage for multer to store files in 'public/temp' directory with original filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp') //specifying the destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)//specifying the filename for uploaded files as their original name
  }
})


//exporting the multer middleware with the configured storage
export const upload = multer({ 
    storage, 
})
