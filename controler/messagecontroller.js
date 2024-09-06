
const Message = require("../models/messagemodel");
const User = require("../models/usermodel");
const Chat = require("../models/chat");
const chat = require("../models/chat");

const addingMessage = async(req,res)=>{

    let {message,chat_id} = req.body;

    try{
        const new_message = new Message({
            sender:req.user._id,
            content:message,
            chat:chat_id
        })
        let response  = await new_message.save()
         response = await response.populate("sender","username")
         response  = await response.populate("chat")
         response = await User.populate(response,{
            path:"chat.users",
            select:"username email"
        })
        const latest_message = await Chat.findByIdAndUpdate(chat_id,{
            latest_message:response
        })
  
        return res.status(200).json(response)
        // console.log(latest_message);
    }catch(error){
        console.log(error);
    }
}
const allMessages = async(req,res)=>{

    let chat_id = req.params.id;

   try{
     const messages = await Message.find({chat:chat_id}).populate("sender","username").populate("chat").lean()
  
    //  let same_user;
     messages.forEach((element) => {
        if(req.user.username == element.sender.username){
  
            element.same_user = true
         }else{
            element.same_user = false 
     
         }
     });
     return res.json(messages)


   }catch(err){
      console.log(err);
   }
}

module.exports = {addingMessage,allMessages} 