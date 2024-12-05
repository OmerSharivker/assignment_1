import {Schema,model} from 'mongoose'

const postSchema =new Schema({
    message:{
        type: String,
        required :true
    },
    ownerId:{
        type: Schema.ObjectId,
        required :true
    }
})


export default model('posts', postSchema);