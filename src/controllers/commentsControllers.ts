
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import {responseReturn}  from '../utils/response';
import commentsModel from '../models/commentsModel';

class PostController {
   postComment = async (req: Request, res: Response): Promise<void> => {
      const { content, postId, userId } = req.body;
      try {
         const newComment = await commentsModel.create({
            content,
            postId: new Types.ObjectId(postId),
            ownerId: new Types.ObjectId(userId)
         });
         if (newComment) {
            responseReturn(res, 201, newComment);
         } else {
            responseReturn(res, 400, { message: "problem with new comment" });
         }
      } catch (error) {
         responseReturn(res, 400, { message: "internal server error" });
      }
   }

   readComment = async (req: Request, res: Response): Promise<void> => {
      const { commentId } = req.params;
      try {
         const comment = await commentsModel.findById(new Types.ObjectId(commentId));
         if (comment) {
            responseReturn(res, 200, comment.content);
         } else {
            responseReturn(res, 400, { message: "problem with new comment" });
         }
      } catch (error) {
         responseReturn(res, 400, { message: "internal server error" });
      }
   }

   updateComment = async (req: Request, res: Response): Promise<void> => {
      const { commentId } = req.params;
      const { content, userId } = req.body;
      try {
         const comment = await commentsModel.findById(new Types.ObjectId(commentId));
         if (comment.ownerId.toString() !== userId) {
            responseReturn(res, 400, { message: "you are not the owner of this comment" });
         }
         const updatedComment = await commentsModel.findByIdAndUpdate(
            new Types.ObjectId(commentId),
            { content: content },
            { new: true }
         );
         if (updatedComment) {
            responseReturn(res, 200, { updatedComment, message: "success" });
         } else {
            responseReturn(res, 400, { message: "problem with new" });
         }
      } catch (error) {
         responseReturn(res, 400, { message: "internal server error" });
      }
   }

   deleteComment = async (req: Request, res: Response): Promise<void> => {
      const { commentId } = req.params;
      const { userId } = req.body; 
      try {
         const comment = await commentsModel.findById(new Types.ObjectId(commentId));
         if(comment.ownerId.toString() !== userId) {
            responseReturn(res, 400, { message: "you are not the owner of this comment" });
         }
         await commentsModel.findByIdAndDelete(new Types.ObjectId(commentId));
         responseReturn(res, 200, { message: "comment deleted successfully" });
      } catch (error) {
         responseReturn(res, 400, { message: "internal server error" });
      }
   }

   getComments = async (req: Request, res: Response): Promise<void> => {
      const { postId } = req.params;
      try {
         const allComments = await commentsModel.find({ postId });
         if (allComments) {
            responseReturn(res, 200, { allComments });
         } else {
            responseReturn(res, 400, { message: "problem with all comments" });
         }
      } catch (error) {
         responseReturn(res, 400, { message: "internal server error" });
      }
   }
}

export default new PostController();
