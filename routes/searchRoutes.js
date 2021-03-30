import express from 'express';
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

router.get('/:keyword', cors(corsOption), (req,res)=>{
    let keyword = req.params["keyword"];
    Article.find({}, (err,data)=>{
        if(err){
            res.render('searchArticle', {
                errorMsg:"Something went wrong. Please try again later."
            })
        }else{
            if(keyword === ""){
                res.render('searchArticle', {
                    errorMsg:"Please give us a search keyword."
                })
            }else{
                let searchResult = data.filter((article)=>{
                    return article.title.toLowerCase().includes(keyword.toLowerCase());
                })
                res.render('searchArticle',{
                    searchResult: searchResult,
                    numOfSearch: searchResult.length,
                    keyword: keyword
                })
            }
        }
    })
})

router.post('/', cors(corsOption), (req,res)=>{
    let keyword = req.body["keyword"];
    console.log(keyword);
    res.redirect(`/search/${keyword}`);
})

module.exports = router;