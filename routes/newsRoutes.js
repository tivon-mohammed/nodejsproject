import { Router, json, urlencoded, request } from 'express'; 
import cors from 'cors' 
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../config'
import {LocalStorage} from 'node-localstorage'
import Article from '../db/model/Article.model' 
import TOPIC from '../db/model/topic.enum' 
import user from '../db/model/user.model' 

//defining constants 
const router = Router(); 
var corsOptions={ 
    origin:'*', 
    optionsSuccessStatus:200 
} 


router.route('/newsform').get((request, response) => { 
    let localStorage = new LocalStorage('./Scratch')
    let token = localStorage.getItem('authToken')
    if(!token){
        return response.redirect('/');
    }
    jwt.verify(token, config.secret, (err, decoded)=>{
        if(err){
            response.redirect('/');
        }
        //console.log(decoded)
        user.findById(decoded.id, { password: 0 }, function (err, userData) {
            if (err) {
                response.redirect('/login')
            }
            if (!userData) {
                response.redirect('/login')
            }
            //console.log(TOPIC)
            response.render('newsAdd.ejs', {message: null, topic : TOPIC})         
        });
    })
}); 

router.route('/newsadd').post(json(), urlencoded({extended:false}),cors(corsOptions), (request, response) => { 
    let articleQuery = request.body;
    if(articleQuery.topic === 'Type of topic'){
        articleQuery.topic = 'General'
    }
    //console.log(articleQuery)
    let localStorage = new LocalStorage('./Scratch')
    let token = localStorage.getItem('authToken')
    if(!token){
        return response.redirect('/login');
    }

    jwt.verify(token, config.secret, (err, decoded)=>{
        if(err){
            response.redirect('/');
        }
        let email = localStorage.getItem('currentuser');

        Article.create({
            title : articleQuery.title,
            content : articleQuery.content,
            writer : email,
            image : articleQuery.image,
            topic : articleQuery.topic
        },(err,item)=>{ 
            if(err) { 
                return response.status(500).send("there was a problem in add new form")
            } else {
                response.render('newsAdd.ejs',{message: 'Successfully added a new article', topic : TOPIC})          
            }        
        }) 
    })
})

router.route('news').get(json(), urlencoded({extended:false}),cors(corsOptions), (request, response) => { 
    let localStorage = new LocalStorage('./Scratch')
    let token = localStorage.getItem('authToken')
    if(!token){
        return response.redirect('/');
    }
    jwt.verify(token, config.secret, (err, decoded)=>{
        if(err){
            response.redirect('/');
        }
        
    })
})

//would take username and email as parameter
router.route('/show').get((request, response) => { 
    let localStorage = new LocalStorage('./Scratch')
    let token = localStorage.getItem('authToken')
    if(!token){
        return response.redirect('/');
    }
    jwt.verify(token, config.secret, (err, decoded)=>{
        if(err){
            response.redirect('/');
        }
        //console.log(decoded)
        let email = localStorage.getItem('currentuser');
        Article.find({writer : email}, { password: 0 }, function (err, data) {
            if (err) {
                response.redirect('/')
            }       
            response.render('show',{data})
        });
    })
}); 

//delete news
router.get("/show/delete/:_id",(req,res)=>{
    var id = req.params._id;
    //console.log(id)
    Article.deleteOne({_id:id},(err)=>{
        if(!err)
        res.send("Article is deleted")
    })
})


//find news
router.get("/show/update/:_id",(req,res)=>{
    var id = req.params._id;
    //console.log(id)
    Article.find({_id:id},(err,article)=>{
        if(!err)
        res.render('newsUpdate',{article})
    })
})

//update news
router.post("/show/update/:_id",(req,res)=>{
    var id = req.params._id;
    var updatedtitle = req.body.title;
    var updatedcontent = req.body.content
    var updatedimage = req.body.image

    //console.log(title)
    Article.updateOne({_id:id},{title:updatedtitle,content:updatedcontent,image:updatedimage},(err)=>{ 
        if(!err)
        res.send("updated")
    })
})

router.get("/show/:_id",(req,res)=>{
    var id = req.params._id;
    //console.log(id)
    Article.find({_id:id},(err,article)=>{
        //console.log(article[0])
        if(err){ 
            res.redirect('/')
        } else {
            user.find({email : article[0].writer}, (err, user)=>{
                //console.log(user)
                if(err){
                    res.redirect('/')
                } else {
                    article[0].writer = user[0].name
                    //console.log(article[0])
                    res.render('articles', {
                        Article: article[0]
                    })
                }
            })
        }   
    })
})

module.exports=router;
