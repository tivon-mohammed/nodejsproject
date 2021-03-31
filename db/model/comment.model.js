import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const CommentSchema = new Schema({
    comment: {type:String},
    name: {type:String, default:"Anon"},
    article: {type:String},
    like: {type:Number, default:0},
    dislike: {type:Number, default:0}
},{
    timestamps: true
},{
    collection:"comments"
});

module.exports = mongoose.model('comment', CommentSchema);