const { response } = require("express");
const postModel = require("../models/postModel");
const { responseReturn } = require("../utils/response");
const {mongo :{ObjectId}} =require('mongoose')


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

    getPostsBySender =  async (req, res) => {
        try {
            const senderPosts = await postModel.find({ 'sender' : req.query.sender});
            if(senderPosts){
                responseReturn(res, 200, {senderPosts});
            }
            else{
                responseReturn(res, 400, {message: "couldnt fetch by sender posts"});
            }
        } catch (error) {
                responseReturn(res, 500, {message: "unknown error"});
        }
    }
    //end method
    
    getPostById =  async (req, res) => {
       const {id} =req.params
      try {
        const post= await postModel.findById(new ObjectId(id))
        if(post)
          responseReturn(res,200,{post,message:"post found by id"})
        else{
            responseReturn(res,400,{message:"post not found by id"})
        }
      } catch (error) {
        responseReturn(res,500,{message:"problem with find by id"})
      }
     }
     //end method  


     updateById =  async (req,res) => {
        const {id} =req.params
        const {message} = req.body
       try {
         const updatePost= await postModel.findByIdAndUpdate(new ObjectId(id),{message : message},{new : true})
       if (updatePost) {
        responseReturn(res,201,{updatePost,message:"post updated by id"})
       } else {
        responseReturn(res,400,{message:"post not updated by id"})
       }
       } catch (error) {
        responseReturn(res,500,{message:"problem with updated by id"})
       }
      }
}

module.exports = new postController();