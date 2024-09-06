const { ObjectId, Timestamp } = require("mongodb")
const mongoose  = require("mongoose")

const chat_schema  = mongoose.Schema({
    name:{type:String,trim:false},
    users:[{type:mongoose.Schema.ObjectId,ref:"User"}],
    is_groupchat:{type:Boolean},
    group_admin:{type:mongoose.Schema.ObjectId,ref:"User"},
    latest_message:{type:mongoose.Schema.ObjectId,ref:"Message"},

},{timestamps:true})

module.exports = mongoose.model("Chat",chat_schema) 