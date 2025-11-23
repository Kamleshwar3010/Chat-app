const { application } = require("express");
const express = require("express");
const path=require("path") 
const app = express();
const http = require('http').createServer(app)
const location=path.join(__dirname,"../chat/chat.html");
app.use(express.static('../chat'));
const port = process.env.PORT||3000;
const io = require('socket.io')(http)

app.get("/",(req,res)=>{
    // app.use(express.static('location'));
    res.sendFile(location);
})
http.listen(port,()=>{
    console.log(`listening at ${port}`);
})

const users={};
// const uname=document.getElementById('input1')
//const btn1=document.getElementById('btn1')
io.on('connection',socket =>{//handle all connection
    socket.on('new-user-joined',uname =>{//handle particular connection
    //  users{socket.id} = uname;
   
        console.log(uname.value);
     socket.brodcast.emit('user-joined',uname)//this msg inform every body that a user is connected
    })


   socket.on('send',msg=>{
    socket.brodcast.emit("messge recived",{message:msg})
   })
})