import { Router, json } from 'express'; 
import cors from 'cors' 
import user from '../db/model/user' 
import {LocalStorage} from 'node-localstorage'
import jwt from 'jsonwebtoken'
import config from '../config'

const router = Router(); 
var corsOptions={ 
    origin:'*', 
    optionsSuccessStatus:200 
} 
// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
    user.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/profile', function (req, res) {
    let localStorage = new LocalStorage('./Scratch')
    let token = localStorage.getItem('authToken')
    console.log("token>>>",token)
    if (!token) {
        res.redirect('/login')
    }
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            res.redirect('/login')
        }
        //console.log(decoded)
        user.findById(decoded.id, { password: 0 }, function (err, user) {
            if (err) {
                res.redirect('/login')
            }
            if (!user) {
                res.redirect('/login')
            }
            res.render('admin.ejs',{user})
        });
    });
});

router.get('/register',  (req, res) => {
    response.render('register.ejs', {message: null, error: null})
});

router.get('/logout', (req,res) => {
    localStorage.removeItem('authtoken');
    res.redirect('/');
})

module.exports = router;