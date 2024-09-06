const express = require("express")
const app = express()
const {createChat,fetchChats,createGroupchat,deleteGroup,leaveGroup} = require("../controler/chatController")
const authentication = require("../middleware/authentication")

app.get("/chats",authentication,fetchChats)
app.post("/chats",authentication,createChat)
            
app.post("/groupchat",authentication,createGroupchat)
app.post("/deletegroupchat",authentication,deleteGroup)
app.post("/leavegroupchat",authentication,leaveGroup)

module.exports = app;