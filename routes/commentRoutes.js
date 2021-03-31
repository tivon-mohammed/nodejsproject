import express from 'express';
import comment from '../db/model/comment.model';


const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(__dirname+'/public'));

const router = express.Router();
router.use(express.urlencoded({extended:true}));
router.use(express.json());

const cors = require('cors');

var corsOption={
    origin:'*',
    optionsSuccessStatus:200
}

router.put('/:commentId/:likeOrDislike', (req,res)=>{
    let commentId = req.params["commentId"];
    let likeOrDislike = req.params["likeOrDislike"];
    comment.findOne({"_id":commentId}, (err,data)=>{
        comment.updateOne(
            {"_id":commentId},
            {
                "$set":{
                    "like": likeOrDislike === "like" ? data.like + 1: data.like,
                    "dislike": likeOrDislike === "dislike" ? data.dislike + 1: data.dislike
                }
            },
            (err,updatedData)=>{
                res.send(updatedData);
            }
        )
    })

})

router.post('/',(req,res)=>{
    comment.create(req.body, (err,data)=>{
        if(err){
            res.send(
                {errorMsg:"Couldn't Post the Comment."}
            )
        }else{
            res.send(data);
        }
    })
})

router.get('/:articleId',(req,res)=>{
    let article = req.params["articleId"];
    comment.find({"article":article},(err,data)=>{
        if(err){
            res.send([]);
        }else{
            res.send(data);
        }
    })
})

module.exports = router;