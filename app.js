const express  = require('express')
const app = express()
const path = require("path")
const cookieParser = require("cookie-parser");
const connect_db = require("./DB config/connection");
const userRoutes = require("./routes/user")
const messageRoutes = require("./routes/message");
const chatRoutes = require("./routes/chat")
const cors = require("cors")

connect_db()
const port = process.env.PORT || 2000
const server = app.listen(port, '0.0.0.0', () => console.log(`running on ${port}`));

const io = require("socket.io")(server,{
    pingTimeout: 60000,
    cors:{  
        origin: "http://52.66.241.139:2000" 
    }
       
})  
io.on("connection",(socket)=>{ 

    socket.on("setup",(user_id)=>{
        socket.join(user_id)
        console.log("connected");
    })
   
    socket.on("join chat",(room)=>{
        socket.join(room)
        console.log("user joined room",room);
    })

    socket.on("group message",(new_message)=>{
        console.log(new_message);

        let chat = new_message.chat;
        
        if(!chat.users) return console.log("no users in the chat");

        socket.to(chat._id).emit("messageRecieved", new_message); 
    })

     socket.on("new message",(new_message)=>{
         console.log(new_message);

         let chat = new_message.chat;
         if(!chat.users) return console.log("no users in the chat");
         
         chat.users.forEach((user)=>{
            if(user._id == new_message.sender._id) return 

            io.to(user._id).emit("messageRecieved", new_message); 
         })
     })
})
 

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.set('views',path.join(__dirname,'views'))
app.set('view engine' , 'hbs')
app.use(express.static(path.join(__dirname,"public")))
app.use(cors());


  app.get('/config', (req, res) => {
    res.json({ apiUrl: process.env.API_URL || 'http://localhost:2000' });
  });

 app.use("/",userRoutes)
 app.use("/message",messageRoutes)
 app.use("/chat",chatRoutes)

  

   