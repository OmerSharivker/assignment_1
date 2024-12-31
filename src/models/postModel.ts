import {Schema,model} from 'mongoose'

const postSchema =new Schema({
    content:{
        type: String,
        required :true
    },
     title:{
        type: String,
        required :true
    },
    likes:{
        type: Number,
        default:0
    },
    comments:{
        type: Number,
        default:0
    },
    ownerId:{
        type: Schema.ObjectId,
        required :true
    }
})


export default model('posts', postSchema);