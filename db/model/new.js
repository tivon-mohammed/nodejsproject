import mongoose from 'mongoose';

const newSchema = new mongoose.Schema({  
  email : String,
  title: String,
  description: String,
  url : String,
  url_image : String,
}, {
  timestamps : true
},{
  collections : "news"
})

export default mongoose.model('new', newSchema)