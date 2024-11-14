const {Schema,model} = require('mongoose')

const commentSchema =new Schema({
   
    content:{
        type: String,
        required :true
    },
    postId:{
        type: Schema.ObjectId,
        required :true
    }
})

module.exports = model('comment',commentSchema)