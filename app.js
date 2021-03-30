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
})


//app configurations

import article from './db/model/Article.model' 

app.set('view engine', 'ejs');
app.set('views', './views');

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
    response.render('register', {message: null, error: null})
})

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/news', newsRoutes);



//start express app
app.listen(port,()=>{
    console.log("app started !!", port)
})