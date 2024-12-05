import { Request, Response } from "express";
import postModel from "../models/postModel";
import { responseReturn } from "../utils/response";
import { Types } from 'mongoose';

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
        try {
            const newPost = await postModel.create({message: req.body.message ,ownerId : userId});
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
        const { message, userId } = req.body;
        try {
            const post = await postModel.findById(new Types.ObjectId(id));
            if(userId !== post.ownerId.toString()){
                responseReturn(res, 400, { message: "you are not the owner of this post" });
            }
            const updatePost = await postModel.findByIdAndUpdate(new Types.ObjectId(id), { message: message }, { new: true });
            if (updatePost) {
                responseReturn(res, 201, { updatePost, message: "post updated by id" });
            } else {
                responseReturn(res, 400, { message: "post not updated by id" });
            }
        } catch (error) {
            responseReturn(res, 500, { message: "problem with updated by id" });
        }
    }
}

export default new PostController();
