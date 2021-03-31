import express from 'express'
import mongoose from 'mongoose'
import newsRoutes from './routes/newsRoutes'
import authRoutes from './routes/authRoutes'
import adminRoutes from './routes/adminRoutes'
import {seedSportsData} from './seed/seedData';
import jwt from 'jsonwebtoken'
import config from './config'
import user from './db/model/user.model' 

//Allen's imports
import http from 'http'
import path from 'path';
import socketIO from 'socket.io'
import { LocalStorage } from 'node-localstorage'
import iplocate from 'node-iplocate'
import publicIP from 'public-ip'
import newsRouter from './routes/newsRoutes'
const bodyparser = require('body-parser');
let localstorage = new LocalStorage('./Scratch')

const contactRoute = require('./contactUs');



//constants declared
const app = express()
const port = 8080
//mongoose connection 
mongoose.connect('mongodb://127.0.0.1:27017/edureka',{useUnifiedTopology:true,useNewUrlParser:true})
const connection=mongoose.connection;
connection.once('open',()=>{
    console.log("MongoDB connected!!!!");
    seedSportsData();
})

const request = require('request');



//mongoose connection 

app.use(bodyparser.urlencoded({
    extended: true
}));



//app configurations

import article from './db/model/Article.model'

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static(__dirname+'/public'));
app.get('/', (request, response) => {
<<<<<<< HEAD
    
    
    article.find({},(err,articles)=>{
        let nonSportsArticles = articles.filter((a)=>(
            a.topic !== "Sport"
        ));
        console.log(nonSportsArticles.length);
        getWeather().then(JSON.parse).then((weather)=>{
            article.find({"topic":"Sport"}).sort({createdAt:-1}).exec((err,sportsNews)=>{
                response.render('index', {
                    articles: nonSportsArticles,
                    news:sportsNews,
                    weather: weather,
                    location: userLocation
                })               
=======
    article.find({ "topic": "Sport" }, (err, sportsNews) => {
        getWeather().then(JSON.parse).then((weather) => {
            response.render('index', {
                news: sportsNews,
                weather: weather
>>>>>>> c255fd8f23daf67446ff256d52f9c2f41670370e
            })
        })
    }).sort({createdAt : -1}).limit(3)
})

import searchRoutes from './routes/searchRoutes';
app.use('/search', searchRoutes);

import sportsRoutes from './routes/sportsRoutes';
app.use('/sports', sportsRoutes);
// app.get('/sports', (request, response) => {
//     response.render('sports.ejs')
// })
import commentRoutes from './routes/commentRoutes';
app.use('/comments', commentRoutes);

app.get('/contactus', (request, response) => {
    response.render('contactus')
})
app.get('/aboutus', (request, response) => {
    response.render('aboutus')
})
app.get('/login', (request, response) => {
    let localStorage = new LocalStorage('./Scratch')
    let token = localStorage.getItem('authToken')
    //console.log("token>>>",token)
    if (!token) {         
        response.render('login', {error: request.query.valid?request.query.valid:'',
        msg: request.query.msg?request.query.msg:''})
    } else {
        response.redirect('/admin/profile');
    }

})
app.get('/register', (request, response) => {
    response.render('register', { message: null, error: null })
})

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/news', newsRoutes);


// Weather API

var weatherUrl;
var userLocation;


app.get('/chatbox', (request, response) => {
    response.render('chatbox.ejs')
})
//Allen code
//index.html file
//server for chat
let server = http.createServer(app).listen(port,()=>{
    publicIP.v4()
    .then(ip=>{
        iplocate(ip)
        .then((results)=>{
            console.log("chat is up on: ", port);
            userLocation = results.city;
            weatherUrl =`http://api.openweathermap.org/data/2.5/forecast/daily?q=${userLocation}&mode=json&units=metric&cnt=5&appid=fbf712a5a83d7305c3cda4ca8fe7ef29`;
            console.log(userLocation);
            console.log(weatherUrl);
        })
    })
})
    

app.get('/weather', (req, res) => {
    var dataPromise = getWeather();
    dataPromise.then(JSON.parse)
    .then(function(result) {
        res.render('weather', { result, title: '***Weather App***' })
    })
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

<<<<<<< HEAD
=======

app.get('/chatbox', (request, response) => {
    response.render('chatbox.ejs')
})
//Allen code
//index.html file
//server for chat
let server = http.createServer(app).listen(port, () => {
    console.log("chat is up on: ", port)
})

>>>>>>> c255fd8f23daf67446ff256d52f9c2f41670370e
let io = socketIO(server)
io.sockets.on('connection', (socket) => {
    //console.log("connected")
    socket.on('nick', (nick) => {
        console.log(nick)
        socket.nickname = nick
<<<<<<< HEAD

        //fetching the location on name set
        publicIP.v4()
                .then(ip=>{
                    iplocate(ip)
                    .then((results)=>{
                        let city = JSON.stringify(results.city,null,2)
                        localstorage.setItem('userLocal',city)
                    })
                })
        })

        socket.on('chat',(data)=>{
            
            
            //console.log(data)
    
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
=======
    })

    socket.on('chat', (data) => {


        //console.log(data)
        publicIP.v4()
            .then(ip => {
                iplocate(ip)
                    .then((results) => {
                        let city = JSON.stringify(results.city, null, 2)
                        localstorage.setItem('userLocal', city)
                    })
            })

        let nickname = socket.nickname ? socket.nickname : '';
        var time = new Date().toLocaleTimeString();
        if (nickname) {
            let list = socket.client.conn.server.clients
            let users = Object.keys(list)
            socket.emit('userList', users)

            let payload = {
                message: data.message,
                nick: nickname,
                location: localstorage.getItem('userLocal'),
                time: time
>>>>>>> c255fd8f23daf67446ff256d52f9c2f41670370e
            }
            if (data.message) {
                socket.emit('chat', payload)
                socket.broadcast.emit('chat', payload)
            }
        }
    })
})




//start express app
// app.listen(port,()=>{
//     console.log("app started !!", port)
// })
