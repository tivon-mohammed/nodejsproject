import e from 'express';
import fs from 'fs';
import Article from '../db/model/Article.model' 
import path from 'path';

export function seedSportsData(){
    fs.readFile(path.resolve(__dirname, "sportsNews.json"), (err,data)=>{
        if(err){
            throw err;
        }else{
            let seed = JSON.parse(data);
            
            var tmp = null;
            for(let s of seed){
                Article.findOne(
                    s,
                    (err,data)=>{
                        if(err){
                            throw err;
                        }else{
                            if(data != null && data !== undefined){
                                console.log("data already exists!", data);
                            }else{
                                Article.create(s, (err,data)=>{
                                    if(err){
                                        throw err;
                                    }else{
                                        console.log("seeded:", data);
                                    }
                                })
                            }
                        }
                    }
                )
            }
        }
    })
}
