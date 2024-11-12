const { response } = require("express");
const postModel = require("../models/postModel");
const { responseReturn } = require("../utils/response");

class postController {
    getAllPosts = async (req, res) => {
        const getPosts = await postModel.find();
        if(getPosts){
            responseReturn(res,200, {getPosts, message: "posts fetched"});
        } else {
            responseReturn(res, 400, {message : "Problem in fetching posts"});
        }
    }
    //end method 

    savePost = async (req, res) => {
       const newPost=  await postModel.create(req.body)
       if (newPost) 
        {
        responseReturn(res,201,newPost._id)
       } else {
        responseReturn(res,400,{message : "new post not working"})
        console.log("new post")
       }

    }
    //end method
}

module.exports = new postController();