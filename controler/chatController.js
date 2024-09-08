const Chat = require("../models/chat");
const User = require("../models/usermodel");
// const Message = require("../models/messagemodel");

const createChat = async (req,res)=>{
    //   let logedin_user = req.user;
      let{user_id} = req.body;
      
        let chat = await Chat.find({is_groupchat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:user_id}}}
        ]})
       .populate("users","-password")
       .populate("latest_message")
    
       chat = await  User.populate(chat,{
          path:"latesmessage.sender",
          select: "username email "
    
       })
       
       if(chat.length > 0){
         res.send(chat[0])
       }else{
    
          let newChat = new Chat({
            name:"sender",
            users:[req.user._id,user_id],
            is_groupchat:false
          })
          const response = await  newChat.save()
          res.send(response)
      
       }
      }
    
      const fetchChats = async (req,res)=>{
         let user_id = req.user._id;
    
       try{
          let chats  = await Chat.find({users:{$elemMatch:{$eq:user_id}}})
          .populate("users","-password")
                                    
          chats.forEach(chat => {
              chat.users = chat.users.filter((obj) => obj._id != user_id)
           });
       
         
          res.status(200).json({chats,user_id})
       }catch(err){
          console.log(err);
       }
      }
    
      const createGroupchat = async(req,res)=>{
      
       try {
          
           let {userArray,groupName} = req.body;
           
           console.log(userArray,"userArray");
           
           let group_admin = req.user._id;
           userArray.push(group_admin)
           const newChat = new Chat({
             name:groupName,
             users:userArray,
             is_groupchat:true,
             group_admin:group_admin
           })
           const response  =  await newChat.save()
           return res.json(response)
          
           
       } catch (error) {
          return res.status(500).json(error.message)
       }
    
      }
    
      const deleteGroup = async(req,res)=>{
       try {
          let {chatId} = req.body; 
          const response = await Chat.findByIdAndDelete(chatId) 

          return res.json(response)  
       } catch (error) {
          
       }
      }
    
    const leaveGroup  = async(req,res)=>{
      try {
       const id  = req.user._id;
       const {chatId} = req.body;
       console.log(chatId,"chat");
       
       const response  = await Chat.updateOne({_id:chatId},{
          $pull:{users:id}
       })
       console.log(response);
       if(response){
          return res.json(response)
       }
        
       
      } catch (error) {
         return res.status(500).json(error.message)
      }
    }


    module.exports = {createChat,fetchChats,createGroupchat,deleteGroup,leaveGroup} 