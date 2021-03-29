import express from 'express'
import mongoose from 'mongoose'
import {seedSportsData} from './seed/seedData';

import newsRoutes from './routes/newsRoutes'
import authRoutes from './routes/authRoutes'
import adminRoutes from './routes/adminRoutes'

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

import article from './models/Article.model';

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
    response.render('login', {error: request.query.valid?request.query.valid:'',
                                msg: request.query.msg?request.query.msg:''})

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