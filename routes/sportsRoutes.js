import express from 'express';
import fetch from 'node-fetch';
import article from '../models/Article.model';

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
    let articleId = req.params["id"];
    console.log("searched ID",articleId);
    article.findOne({"_id": articleId}, (err, data)=>{
        console.log(data);
        if(err){
            throw err;
        }else{
            res.render('sportsNews', {
                article: data
            })
        }
    })
})

router.get('/', cors(corsOption), (req,res)=>{
    fetch("https://www.thesportsdb.com/api/v1/json/1/eventspastleague.php?id=4328")
    .then(response => response.json()).then(data => {
        let events = data.events;
        article.find({}, (err,data)=>{
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
    let articleQuery = req.body;
    article.update(
        articleQuery,
        {
            "$set":articleQuery,
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
    // article.create(articleQuery, (err, data)=>{
    //     if(err){
    //         throw err;
    //     }else{
    //         res.send(data);
    //     }
    // })
})

module.exports = router;