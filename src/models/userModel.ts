import mongoose, { Schema, Document } from 'mongoose';



const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password:{type: String , required: true},
    refreshTokens: { type: [String], default: [] }
});

const User = mongoose.model('users', UserSchema);

export default User;