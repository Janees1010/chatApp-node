const mongoose = require("mongoose")

const user_schema = mongoose.Schema({
    username:{
      type:String,
      required:true
    }, 
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{  
        type:String,
        required:true
    },
    avatar:{
        type:String,
        default:"https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
    },

},{timestamps:true}) 

module.exports  = mongoose.model("User",user_schema)