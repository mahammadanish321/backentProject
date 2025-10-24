// Utility function to simplify async route handling and automatically catch errors
const asyncHandler =(requestHandelar)=>{
   return (req,res,next)=>{
        // Wraps the async request handler in a Promise and forwards any errors to Express's error handler
        Promise.resolve(requestHandelar(req,res,next)).catch((err)=>next(err))
    }
}
    

export { asyncHandler } // Exporting asyncHandler for use in other modules











// const asyncHandler =(fn)=> async (req,res,next)=>{
//     try{
//        await fn(req,res,next)  
//     }catch(error){
//         res.status(error.code||500).json({
//             success:false,
//             message:error.message||"Internal Server Error"
            
//         })
//     }
// }