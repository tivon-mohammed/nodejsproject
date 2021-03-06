import mongoose from 'mongoose';
import TOPIC from './topic.enum' 
const Schema = mongoose.Schema;


const ArticleSchema = new Schema({
    title: {type: String},
    content: {type:String},
    writer: {type: String},
    image: {type: String},
    topic : {
        type : String,
        enum : TOPIC,
        default : 'General'
    }
},{
    timestamps: true
},{
    collection:"Articles"
});

module.exports = mongoose.model('Article', ArticleSchema);
