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
    var sportDetails = {
        epl:null, eplTeams:null, nfl:null, nflTeams:null, nba:null, nbaTeams:null,
        mlb:null, mlbTeams:null, nhl:null, nhlTeams:null, news:null
    };
    fetch("https://www.thesportsdb.com/api/v1/json/1/eventspastleague.php?id=4328")
    .then(response => response.json()).then(data => {
        sportDetails.epl = data.events;
        return fetch("https://www.thesportsdb.com/api/v1/json/1/eventspastleague.php?id=4391");
    })
    .then(response => response.json()).then(data => {
        sportDetails.nfl = data.events;
        return fetch("https://www.thesportsdb.com/api/v1/json/1/eventspastleague.php?id=4387");
    })
    .then(response => response.json()).then(data => {
        sportDetails.nba = data.events;
        return fetch("https://www.thesportsdb.com/api/v1/json/1/eventspastleague.php?id=4424");
    })
    .then(response => response.json()).then(data => {
        sportDetails.mlb = data.events;
        return fetch("https://www.thesportsdb.com/api/v1/json/1/eventspastleague.php?id=4380");
    })
    .then(response => response.json()).then(data => {
        sportDetails.nhl = data.events;
        return fetch("https://www.thesportsdb.com/api/v1/json/1/lookup_all_teams.php?id=4328");
    })
    .then(response => response.json()).then(data => {
        let epl = new Map();
        for(let team of data.teams){
            epl.set(team.idTeam,team.strTeamBadge);
        }
        sportDetails.eplTeams = epl;
        return fetch("https://www.thesportsdb.com/api/v1/json/1/lookup_all_teams.php?id=4391");
    })
    .then(response => response.json()).then(data => {
        let nfl = new Map();
        for(let team of data.teams){
            nfl.set(team.idTeam,team.strTeamBadge);
        }
        sportDetails.nflTeams = nfl;
        return fetch("https://www.thesportsdb.com/api/v1/json/1/lookup_all_teams.php?id=4387");
    })
    .then(response => response.json()).then(data => {
        let nba = new Map();
        for(let team of data.teams){
            nba.set(team.idTeam,team.strTeamBadge);
        }
        sportDetails.nbaTeams = nba;
        return fetch("https://www.thesportsdb.com/api/v1/json/1/lookup_all_teams.php?id=4424");
    })
    .then(response => response.json()).then(data => {
        let mlb = new Map();
        for(let team of data.teams){
            mlb.set(team.idTeam,team.strTeamBadge);
        }
        sportDetails.mlbTeams = mlb;
        return fetch("https://www.thesportsdb.com/api/v1/json/1/lookup_all_teams.php?id=4380");
    })
    .then(response => response.json()).then(data => {
        let nhl = new Map();
        for(let team of data.teams){
            nhl.set(team.idTeam,team.strTeamBadge);
        }
        sportDetails.nhlTeams = nhl;
        Article.find({"topic":"Sport"}).sort({createdAt:-1}).exec((err,data)=>{
            sportDetails.news = data;
            res.render('sports', sportDetails);
        })
    })
    // fetch("https://www.thesportsdb.com/api/v1/json/1/eventspastleague.php?id=4328")
    // .then(response => response.json()).then(data => {
    //     let epl = data.events;
    //     fetch("https://www.thesportsdb.com/api/v1/json/1/eventspastleague.php?id=4391")
    //     .then(response => response.json()).then(data => {
    //         let nfl = data.events;
    //         Article.find({"topic":"Sport"}).sort({createdAt:-1}).exec((err,data)=>{
    //             res.render('sports', {
    //                 epl: epl,
    //                 nfl: nfl,
    //                 news: data
    //             })
    //         })
    //     })  
    // }).catch((err)=>{
    //     res.render('sports',{
    //         events: [],
    //         news: []
    //     })
    // })
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