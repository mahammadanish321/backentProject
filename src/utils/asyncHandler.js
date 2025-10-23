//utility function to handle asynchronous request handlers in Express.js
const asyncHandler =(requestHandelar)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandelar(req,res,next)).catch((err)=>next(err))
    }
}
    

export { asyncHandler }











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