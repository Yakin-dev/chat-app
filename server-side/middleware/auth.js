import User from "../models/user.js";
import jwt from "jsonwebtoken";



export const protectedRoute = async (req,res,next) => {
 try {
   let token = req.headers.authorization?.split(" ")[1];
   if (!token) {
     return res
       .status(401)
       .json({ success: false, message: "No token provided" });
   }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id).select("-password");

    if(!user){
        res.json({success:false,message : "User Not Found"});
    }
    req.user = user;
    next();
 } catch (error) {
     console.error("Auth error:", error);
    res.json({success:false, message : error.message})
 }
}
export default protectedRoute