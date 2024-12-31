import mongoose, { Schema, Document } from 'mongoose';


const UserSchema =new Schema({
    email:{
        type: String,
        required :true,
        unique: true
    },
    password:{
        type: String,
        required :true
    },
    refreshTokens: {
         type: [String], default: [] 
    },
    image:{
        type: String,
        default: ''
    },
    userName:{
        type: String,
        required :true,
    }
})

const User = mongoose.model('users', UserSchema);

export default User;