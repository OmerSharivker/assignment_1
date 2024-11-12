const {Schema,model} = require('mongoose')

const postSchema =new Schema({
    "message": String,
    "sender":Number
})

module.exports = model('posts',postSchema)