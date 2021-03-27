import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {type: String},
    content: {type:String},
    writer: {type: String},
    image: {type: String},
},{
    timestamps: true
},{
    collection:"Articles"
});

module.exports = mongoose.model('Article', ArticleSchema);
