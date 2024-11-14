const { response } = require("express");
const postModel = require("../models/postModel");
const { responseReturn } = require("../utils/response");
const {mongo :{ObjectId}} =require('mongoose');
const commentsModel = require("../models/commentsModel");


class postController {
    postComment = async (req, res) => {
     const {content,postId}=req.body;
     try {
        const newComment= await commentsModel.create({
            content,
            postId : new ObjectId(postId)
         })
         if (newComment) {
         responseReturn(res,201,newComment)
         } else {
            responseReturn(res,400,{message:"problem with new comment"})
         }
     } catch (error) {
        responseReturn(res,400,{message:"internal server error "})
     }

    }
    //end method 

}

module.exports = new postController();