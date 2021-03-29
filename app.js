import express from 'express'
import mongoose from 'mongoose'

const contactRoute = require('./contactUs');



//constants declared
const app=express()
const port=6500
app.use(express.static('./public'))
//app.use(bodyParser.json())
//app.use()

//mongoose connection 
mongoose.connect('mongodb://127.0.0.1:27017/edureka',{useUnifiedTopology:true,useNewUrlParser:true})
const connection=mongoose.connection;
connection.once('open',()=>{
    console.log("MongoDB connected!!!!")
})






app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (request, response) => {
    response.render('index')
})
app.get('/sports', (request, response) => {
    response.render('sports.ejs')
})


// app.get('/contactus', (request, response) => {
//     response.render('contactus')
// })
app.use(express.json());
app.use('/', contactRoute);


app.get('/aboutus', (request, response) => {
    response.render('aboutus')
})

//start express app
app.listen(port,()=>{
    console.log("app started !!", port)
})