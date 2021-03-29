import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({  
  name: String,
  email: String,
  password: String
},
{
    collections: "users"
});

export default mongoose.model('user', userSchema)