import { Request, Response } from "express";
import postModel from "../models/postModel";
import { responseReturn } from "../utils/response";
import { Types } from 'mongoose';
import commentsModel from "../models/commentsModel";

class PostController {
    getAllPosts = async (req: Request, res: Response): Promise<void> => {
        try {
            const getPosts = await postModel.find();
            if (getPosts) {
                responseReturn(res, 200, { getPosts, message: "posts fetched" });
            } else {
                responseReturn(res, 400, { message: "Problem in fetching posts" });
            }
        } catch (error) {
            responseReturn(res, 500, { message: "unknown error" });
        }
    }

    savePost = async (req: Request, res: Response): Promise<void> => {
        const {userId}=req.body
        console.log(userId)
        try {
            const newPost = await postModel.create({content: req.body.content, title: req.body.title ,ownerId : userId});
            if (newPost) {
                responseReturn(res, 201, newPost);
            } else {
                responseReturn(res, 400, { message: "new post not working" });
                console.log("new post");
            }
        } catch (error) {
            responseReturn(res, 500, { message: "unknown error" });
        }
    }

    getPostsBySender = async (req: Request, res: Response): Promise<void> => {
        try {
            const senderPosts = await postModel.find({ 'ownerId': req.body.userId });
            if (senderPosts) {
                responseReturn(res, 200, { senderPosts });
            } else {
                responseReturn(res, 400, { message: "couldn't fetch the specific user posts" });
            }
        } catch (error) {
            responseReturn(res, 500, { message: "unknown error" });
        }
    }

    getPostById = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            const post = await postModel.findById(new Types.ObjectId(id));
            if (post) {
                responseReturn(res, 200, { post, message: "post found by id" });
            } else {
                responseReturn(res, 400, { message: "post not found by id" });
            }
        } catch (error) {
            responseReturn(res, 500, { message: "problem with find by id" });
        }
    }

    updateById = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { content, title, userId } = req.body;
        try {
            const post = await postModel.findById(new Types.ObjectId(id));
            if(userId !== post.ownerId.toString()){
                responseReturn(res, 400, { message: "you are not the owner of this post" });
            }
            const updatePost = await postModel.findByIdAndUpdate(new Types.ObjectId(id), { content, title } , { new: true });
            if (updatePost) {
                responseReturn(res, 201, { updatePost, message: "post updated by id" });
            } else {
                responseReturn(res, 400, { message: "post not updated by id" });
            }
        } catch (error) {
            responseReturn(res, 500, { message: "problem with updated by id" });
        }
    }

    likePost = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { userId } = req.body;
        try {
            const post = await postModel.findById(new Types.ObjectId(id));
            if (post.likes.includes(userId)) {
                post.numLikes = post.numLikes - 1;
                post.likes = post.likes.filter((like) => like.toString() !== userId);
                await post.save();
                responseReturn(res, 200, { message: "post unliked" });
            }
            const likePost = await postModel.findByIdAndUpdate(new Types.ObjectId(id), { $push: { likes: userId } }, { new: true });
            post.numLikes = post.numLikes + 1;
            await post.save();
            if (likePost) {
                responseReturn(res, 200, { likePost, message: "post liked" });
            } else {
                responseReturn(res, 400, { message: "post not liked" });
            }
        } catch (error) {
            responseReturn(res, 500, { message: "problem with like post" });
        }
    }
    deletePost = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { userId } = req.body;
        try {
            const post = await postModel.findById(new Types.ObjectId(id));
            if(post.ownerId.toString() !== userId){
                responseReturn(res, 400, { message: "you are not the owner of this post" });
            }
            const deletePost = await postModel.findByIdAndDelete(new Types.ObjectId(id));
            if (deletePost) {
                await commentsModel.deleteMany({ postId: new Types.ObjectId(id) });
                responseReturn(res, 200, { message: "post deleted" });
            } else {
                responseReturn(res, 400, { message: "post not deleted" });
            }
        } catch (error) {
            responseReturn(res, 500, { message: "problem with delete post" });
        }
    }
}

export default new PostController();
