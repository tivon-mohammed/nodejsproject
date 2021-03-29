const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

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

router.get('/contactus', (req, res) => {
    res.render('contactus');
})

router.post('/post', function (req, res) {
    console.log(req.body);
    res.send("recieved your request!");

    formData(req.body);
});

module.exports = router;


