import express from 'express'
import mongoose from 'mongoose'

//constants declared
const app = express()
const port = 6500

const request = require('request');
const weatherUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?q=London&mode=json&units=metric&cnt=5&appid=fbf712a5a83d7305c3cda4ca8fe7ef29";


//mongoose connection 
mongoose.connect('mongodb://127.0.0.1:27017/edureka', { useUnifiedTopology: true, useNewUrlParser: true })
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB connected!!!!")
})


//app configurations


app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (request, response) => {
    response.render('index')
})
app.get('/sports', (request, response) => {
    response.render('sports.ejs')
})
app.get('/contactus', (request, response) => {
    response.render('contactus')
})
app.get('/aboutus', (request, response) => {
    response.render('aboutus')
})

app.get('/weather', (req, res) => {
    var dataPromise = getWeather();
    dataPromise.then(JSON.parse)
        .then(function(result) {
            res.render('weather', { result, title: '***Weather App***' })
        })
})

//start express app
app.listen(port, () => {
    console.log("app started !!", port)
})


function getWeather(url) {
    // Setting URL and headers for request
    var options = {
        url: weatherUrl,
        headers: {
            'User-Agent': 'request'
        }
    };
    // Return new promise 
    return new Promise(function(resolve, reject) {
        // Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    })
}



app.get('/weatherwithoutpromise', (req, res) => {
    request(url, (err, response, body) => {
        if (err) {
            console.log(err);
        } else {

            const output = JSON.parse(body);
            res.send(output);
        }
    });
});