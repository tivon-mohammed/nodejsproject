import express from 'express'
import mongoose from 'mongoose'
//Allen imports
import http from 'http'
import path from 'path';
import socketIO from 'socket.io'
import {LocalStorage} from 'node-localstorage'
import iplocate from 'node-iplocate'
import publicIP from 'public-ip'
let localstorage= new LocalStorage('./Scratch')

//constants declared
const app=express()
const port=6500

//mongoose connection 
mongoose.connect('mongodb://127.0.0.1:27017/edureka',{useUnifiedTopology:true,useNewUrlParser:true})
const connection=mongoose.connection;
connection.once('open',()=>{
    console.log("MongoDB connected!!!!")
})


//app configurations
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.set('views', './views');



app.get('/', (request, response) => {
    response.render('index')
})
app.get('/sports', (request, response) => {
    response.render('sports.ejs')
})
app.get('/contactus', (request, response) => {
    response.render('contactus')
})
app.get('/aboutus', (request, response) => {
    response.render('aboutus')
})



app.get('/chatbox', (request, response) => {
    response.render('chatbox.ejs')
})
//Allen code
//index.html file
//server for chat
let server = http.createServer(app).listen(port,()=>{
    console.log("chat is up on: ", port)
})
let io = socketIO(server)
io.sockets.on('connection',(socket)=>{
    //console.log("connected")
    socket.on('nick',(nick)=>{
        console.log(nick)
        socket.nickname = nick
        })

        socket.on('chat',(data)=>{
            
            
            //console.log(data)
            publicIP.v4()
                .then(ip=>{
                    iplocate(ip)
                    .then((results)=>{
                        let city = JSON.stringify(results.city,null,2)
                        localstorage.setItem('userLocal',city)
                    })
                })
    
            let nickname = socket.nickname?socket.nickname:'';
                var time = new Date().toLocaleTimeString();
                if(nickname){
                    let list = socket.client.conn.server.clients
                    let users = Object.keys(list)
                    socket.emit('userList',users)

            let payload={
                message:data.message,
                nick:nickname,
                location:localstorage.getItem('userLocal'),
                time:time
            }
            if(data.message){
            socket.emit('chat',payload)
            socket.broadcast.emit('chat',payload)
            }
          }
     })
})




// //start express app
// app.listen(port,()=>{
//     console.log("app started !!", port)
// })
