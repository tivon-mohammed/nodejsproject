import { Router, json, urlencoded } from 'express'; 
import cors from 'cors' 
import user from '../db/model/user.model' 
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../config'
import {LocalStorage} from 'node-localstorage'

//defining constants 
const router = Router(); 
var corsOptions={ 
    origin:'*', 
    optionsSuccessStatus:200 
} 

router.route('/register').post(json(), urlencoded({extended:false}),cors(corsOptions), (request, response) => { 
    let hashedPassword = bcrypt.hashSync(request.body.password, 8)

    user.findOne({ email: request.body.email }, function (err, data) {
        if (err) {
            return res.status(500).send('Error on the server.');
        }
        const string = encodeURIComponent('! Please enter valid value');
        //console.log(data);
        if (!data) { 
            // console.log("no account")
            user.create({
                name : request.body.name,
                email : request. body.email,
                password : hashedPassword
            },(err,userData)=>{ 
                if(err) { 
                    return response.status(500).send("there was a problem in registering form")
                } else {
                    let token = jwt.sign({id: userData.id}, config.secret, {expiresIn: 86400})
                    let localStorage = new LocalStorage('./Scratch');
                    localStorage.setItem('authToken', token)    
                    response.render('register.ejs', {message: 'Register successfully. Please Login', error: null})        
                }        
            }) 
        } else{
            // console.log("Account existed. Please login")
            response.render('register.ejs', {message: null, error : 'Account existed. Please login'}) 
        }
    });
}); 


router.route('/login').post(json(), urlencoded({extended:false}),cors(corsOptions), (req, res) => { 
    user.findOne({ email: req.body.email }, function (err, userData) {
        if (err) {
            return res.status(500).send('Error on the server.');
        }
        const string = encodeURIComponent('! Please enter valid value');
        if (!userData) { 
            res.render('login.ejs', {error: 'Please enter correct credential',
                                msg: req.query.msg?req.query.msg:''})
        } else{
            const passwordIsValid = bcrypt.compareSync(req.body.password, userData.password);
            if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
            let localStorage = new LocalStorage('./Scratch');
            let token = jwt.sign({id: userData.id}, config.secret, {expiresIn:86400})
            //console.log("toekn, auth" + token)
            localStorage.setItem('authToken', token)   
            res.redirect('/admin/profile');
        }
    });
}); 


router.route('/verify').post(json(), urlencoded({extended:false}),cors(corsOptions), (request, response) => { 
    let token = request.headers['x-access-toekn'];
    if(!token){
        return response.status(401).send({auth: false, message: 'no token provided'})
    }
    jwt.verify(token, config.secret, (err, decoded)=>{
        if(err){
            return response.status(500).send({auth: false, message:'wrong token'})
        }
        user.findById(decoded.id, {password:0}, (err,user)=>{
            if(err){
                return response.status(500).send('problem in finding user')
            }
            if(!user){
                return response.status(404).send('no user found')
            }
            return response.status(200).send(user);
        })
    })
});
export default router;