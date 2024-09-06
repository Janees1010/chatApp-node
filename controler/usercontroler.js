const User = require("../models/usermodel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()



 async function signup(req,res){
   console.log(req.body);
  let {username,password,email} = req.body;
  
   try{
      let hashed_password = await bcrypt.hash(password,10)

      const user = new User({
           username:username,
           email:email,
           password:hashed_password
      })
      const response  = await user.save()
      if(response){
          const token  = jwt.sign({_id:response._id,username:response.username},process.env.SECRET_KEY)
          res.cookie('token',token,{httpOnly:true, maxAge: 3600000})
          res.redirect('/')
          return res.status(200).json(response)
      }
   }catch(err){
      console.log(err);
      return res.status(500).json(err.message) 
   }
}

const signin = async (req,res)=>{
   let {email,password} = req.body;

   try{
       const response = await User.findOne({email:email})
       if(response){
         bcrypt.compare(password,response.password,(err,user)=>{
            if(err){
                return res.status(500).json({message:err.message})
            }
            if(user){
               //  return res.status(200).json({message:"signin successfull",response});
               console.log("response",response);
               console.log("username",response.username);
               const token  = jwt.sign({_id:response._id,username:response.username},process.env.SECRET_KEY)
               res.cookie('token',token,{httpOnly:true, maxAge: 3600000})
               res.redirect("/");
                
            }else{
                return res.status(500).json({message:"incorrect password"})
            }
         })
       }
   }catch(err){
      return res.status(500).json(err.message)
   }
}



const searchUser = async(req,res)=>{ 

    let {query} = req.body;
    console.log(req.user);
   
   try{
      const response  = await User.find({username:new RegExp(query,'i'),_id:{$ne:req.user._id}})
      return res.status(200).json(response)
   }catch(err){
     return res.status(500).json(err.message)
   }
    
}




module.exports = {signup,searchUser,signin}     