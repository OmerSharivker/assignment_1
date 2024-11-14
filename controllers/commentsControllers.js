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

   readComment = async (req, res) => {
      const {commentId}=req.params;
      try {
         const comment = await commentsModel.findById(new ObjectId(commentId));
         if(comment){
            responseReturn(res,200,comment.content);
         }else{
            responseReturn(res,400,{message:"problem with new comment"});
         }
      } catch (error) {
         responseReturn(res,400,{message:"internal server error "});
      }
   }
   //end method

   updateComment = async (req, res) => {
      const {commentId}=req.params;
      const {content} = req.body;
      try {
         const updatedComment = await commentsModel.findByIdAndUpdate(new ObjectId(commentId), {content : content}, {new : true});
         if(updatedComment){
            responseReturn(res,200,{updatedComment, message:"success"});
         }else{
            responseReturn(res,400,{message:"problem with new "});
         }
      } catch (error) {
         responseReturn(res,400,{message:"internal server error "});
      }
   }
   //end method

   deleteComment = async (req, res) => {
    const {commentId}=req.params;
    try {
        await commentsModel.findByIdAndDelete(new ObjectId(commentId));
          responseReturn(res,200,{message:"comment deleted successfully"});
    } catch (error) {
       responseReturn(res,400,{message:"internal server error "});
    }
 }
 //end method

   getComments= async (req, res) => {
    const {postId}=req.params;
     try {
        const allComments= await commentsModel.find({postId})
        if (allComments) {
            responseReturn(res,200,{allComments});
        }else{
            responseReturn(res,400,{message:"problem with all comments "});
        }
     } catch (error) {
        responseReturn(res,400,{message:"internal server error "});
    }
 }
 //end method
}

module.exports = new postController();