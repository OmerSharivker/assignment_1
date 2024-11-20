import {Schema,model} from 'mongoose'

const postSchema =new Schema({
    "message": String,
    "sender":Number
})


export default model('posts', postSchema);