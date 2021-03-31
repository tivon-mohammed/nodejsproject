import express from 'express';
import fetch from 'node-fetch';
import Article from '../db/model/Article.model' 


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

router.use((req,res,next)=>{
    console.log("Time", Date.now());
    next();
})

router.get('/:id', cors(corsOption), (req,res)=>{
    let ArticleId = req.params["id"];
    console.log("searched ID",ArticleId);
    Article.findOne({"_id": ArticleId}, (err, data)=>{
        console.log(data);
        if(err){
            throw err;
        }else{
            res.render('sportsNews', {
                Article: data
            })
        }
    })
})

router.get('/', cors(corsOption), (req,res)=>{
    fetch("https://www.thesportsdb.com/api/v1/json/1/eventspastleague.php?id=4328")
    .then(response => response.json()).then(data => {
        let events = data.events;
        Article.find({"topic":"Sport"}).sort({createdAt:-1}).exec((err,data)=>{
            res.render('sports', {
                events: events,
                news: data
            })
        })
    }).catch((err)=>{
        res.render('sports',{
            events: [],
            news: []
        })
    })
})

router.post('/post', cors(corsOption), (req,res)=>{
    let ArticleQuery = req.body;
    Article.update(
        ArticleQuery,
        {
            "$set":ArticleQuery,
        },
        {
            "upsert":true
        },
        (err,data)=>{
            if(err){
                throw err;
            }else{
                res.send(data);
            }
        }
    )
})

module.exports = router;