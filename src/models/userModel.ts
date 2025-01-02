import mongoose, { Schema, Document, model } from 'mongoose';


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
        default: null
    },
    userName:{
        type: String,
        required :true,
    }
})

export default model('user', UserSchema);