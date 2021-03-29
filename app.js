import express from 'express'
import mongoose from 'mongoose'
import newsRoutes from './routes/newsRoutes'
import authRoutes from './routes/authRoutes'
import adminRoutes from './routes/adminRoutes'
import {seedSportsData} from './seed/seedData';

//Allen's imports
import http from 'http'
import path from 'path';
import socketIO from 'socket.io'
import {LocalStorage} from 'node-localstorage'
import iplocate from 'node-iplocate'
import publicIP from 'public-ip'
import newsRouter from './routes/newsRoutes'
const bodyparser = require('body-parser');
let localstorage= new LocalStorage('./Scratch')

const contactRoute = require('./contactUs');



//constants declared
const app=express()
const port=8008
//mongoose connection 
mongoose.connect('mongodb://127.0.0.1:27017/edureka',{useUnifiedTopology:true,useNewUrlParser:true})
const connection=mongoose.connection;
connection.once('open',()=>{
    console.log("MongoDB connected!!!!");
    seedSportsData();
}

const request = require('request');
const weatherUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?q=London&mode=json&units=metric&cnt=5&appid=fbf712a5a83d7305c3cda4ca8fe7ef29";


//mongoose connection 

app.use(bodyparser.urlencoded({
    extended:true
}));




import article from './db/model/Article.model' 

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.set('views', './views');
//route for admin
app.use('/news',newsRouter);



app.use(express.static(__dirname+'/public'));

app.get('/', (request, response) => {
    article.find({},(err,data)=>{
        response.render('index', {
            news:data
        })
    })
    // response.render('index')
})

import sportsRoutes from './routes/sportsRoutes';
app.use('/sports', sportsRoutes);
// app.get('/sports', (request, response) => {
//     response.render('sports.ejs')
// })
app.get('/contactus', (request, response) => {
    response.render('contactus')
})

// app.get('/contactus', (request, response) => {
//     response.render('contactus')
// })
app.use(express.json());
app.use('/', contactRoute);


app.get('/aboutus', (request, response) => {
    response.render('aboutus')
})
app.get('/login', (request, response) => {
    response.render('login', {error: request.query.valid?request.query.valid:'',
                                msg: request.query.msg?request.query.msg:''})

})
app.get('/register', (request, response) => {
    response.render('register', {message: null, error: null})
})

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/news', newsRoutes);





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




app.get('/weather', (req, res) => {
    var dataPromise = getWeather();
    dataPromise.then(JSON.parse)
        .then(function(result) {
            res.render('weather', { result, title: '***Weather App***' })
        })
})

//start express app
app.listen(port, () => {
    console.log("app started !!", port)
})


function getWeather(url) {
    // Setting URL and headers for request
    var options = {
        url: weatherUrl,
        headers: {
            'User-Agent': 'request'
        }
    };
    // Return new promise 
    return new Promise(function(resolve, reject) {
        // Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    })
}



app.get('/weatherwithoutpromise', (req, res) => {
    request(url, (err, response, body) => {
        if (err) {
            console.log(err);
        } else {

            const output = JSON.parse(body);
            res.send(output);
        }
    });
});
