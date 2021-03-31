const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


// specifying schema of the database
const formSchema = new mongoose.Schema(
    {
        data: Object,
    },
    { collection: "survey_form" }
);

const Form = mongoose.model("Form", formSchema)

const formData = (bodyData) => {
    Form({ data: bodyData }).save((err) => {
        if (err) {
            throw err;
        }
    })
}


router.get('/:success?', (req, res) => {
    let success = req.params['success'];
    console.log(success);
    if(success === undefined){
        res.render('contactus', {msg:null});
    }else{
        res.render('contactus', {msg:"We've received your feedback! Thank you."});
    }
    
})

router.post('/post', function (req, res) {
    console.log(req.body);
    res.redirect('/contactus/success');

    formData(req.body);
});

module.exports = router;


