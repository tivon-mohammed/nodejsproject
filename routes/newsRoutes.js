import express from 'express';
import mongoose from 'mongoose'
import Article from '../db/model/Article.model'



const router = express.Router()
var corsOptions={ 
    origin:'*', 
    optionsSuccessStatus:200 
}


//would take username and email as parameter
router.get("/show",(req,res)=>{
    //add temp data
    // Article.create({
    //     title : "Article 3",
    //     content : "something2 something2",
    //     writer : "xyz@gmail.com",
    //     image : "Image2",
    // })
    Article.find((err,data)=>{
        if(!err)
        res.render('show',{data})
    })

})

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

module.exports=router;