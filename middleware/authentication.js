const jwt  = require("jsonwebtoken");
require("dotenv").config()


const authentication = (req,res,next)=>{

    const token = req.headers.cookie ?  req.headers.cookie.split("token=")[1] : ""
    if(token){
        jwt.verify(token,process.env.SECRET_KEY,(err,user)=>{
            if(err){
                return res.status(500).json({message:"invalid token"})
            }
            req.user = user; 
            next()
        })
    }else{
        // return res.status(500).json({message:"token not provided"})
        res.redirect("/signin")
    }

 
}  

module.exports = authentication