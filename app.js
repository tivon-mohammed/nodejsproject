import express from 'express'
import mongoose from 'mongoose'
import newsRoutes from './routes/newsRoutes'
import authRoutes from './routes/authRoutes'
import adminRoutes from './routes/adminRoutes'

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