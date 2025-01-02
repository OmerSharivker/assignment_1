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
        type: [Schema.ObjectId],
    },
    numLikes:{
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
    },
    userName:{
        type: String,
        required :true
    },
    userImg:{
        type: String,
        required :true
    },
    postImg:{
        type: String,
        required :true
    },

})


export default model('posts', postSchema);