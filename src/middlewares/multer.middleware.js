import multer from "multer"; // Importing multer for handling file uploads in local server



//configuring storage for multer to store files in 'public/temp' directory with original filename
const storage = multer.diskStorage({
  
  destination: function (req, file, cb)  {
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



// import multer from "multer";

// //The main use of Multer is to handle file uploads from an HTML form that includes a file input field

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/temp");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null,uniqueSuffix + "-" + file.originalname); // this code save the file in unique name assingnment
//   },
// });

// export const upload = multer({
//   storage,
// });
