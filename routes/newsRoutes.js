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
        let email = localStorage.getItem('currentuser')
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


export default router;