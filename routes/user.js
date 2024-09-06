const express = require("express")
const app = express()
const {signup,searchUser,signin} = require("../controler/usercontroler")
const authentication = require("../middleware/authentication")


app.get("/",authentication,(req,res)=>{
    res.render("home",{user:req.user.username})
}) 
app.get("/signin",(req,res)=>{ 
    res.render("signin")
})

app.get("/getid",authentication,(req,res)=>{
    let user = req.user._id
    res.json(user)
})

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/signin')
})

  

app.post("/signup",signup)
app.post("/signin",signin)

app.post("/user",authentication,searchUser)



module.exports = app;                     