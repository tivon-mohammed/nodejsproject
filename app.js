import express from 'express';
const app = express();
const db = require('./db/db');

app.use(express.urlencoded({extended:true}));
app.use(express.json());

const port = 8080;

app.listen(port, ()=>{
    console.log("Successfully connected to express server!");
})