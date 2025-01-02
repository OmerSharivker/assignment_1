import { Request, Response } from 'express';
import { Types } from 'mongoose';
import {responseReturn}  from '../utils/response';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import { createToken } from '../utils/token';

class authControllers {

login = async (req: Request, res: Response): Promise<void> => {
    const {email,password} =req.body
    
    if(!email || !password){
      responseReturn(res,400,{error : "password and email are required"})
    }
  try {
      const user = await User.findOne({email})
      if(!user){
            responseReturn(res,400,{error : "password or email are not found"})
            return;
      }
      const isValid = await bcrypt.compare(password,user.password)
      if(!isValid){
            responseReturn(res,400,{error : "password or email are not found"})
            return;
      }
      const accessToken  = await createToken({ id: user._id },"1h")
      const refreshToken = await createToken({ id: user._id }, "7d");
      user.refreshTokens = user.refreshTokens ? [...(user.refreshTokens as string[]), refreshToken] : [refreshToken];
      await user.save();
      
      responseReturn(res,200,{refreshToken, accessToken, message : "login ok"})
    
  } catch (error) {
      responseReturn(res,500,{error : "internal server error"})
  }
}

   register = async (req: Request, res: Response): Promise<void> => {
      const {email, password, userName} = req.body;
      if(!email || !password){
        responseReturn(res, 400, { error: "email or password not valid" });
        return;
      }
      try {
         const userExists = await User.findOne({email});
         if (userExists) { 
            responseReturn(res,400,{error : "User already exists"});
            return;
         }
         const salt = await bcrypt.genSalt(10);
         const hashPassword = await bcrypt.hash(password,salt);
         const user = await User.create({
            email,
            password : hashPassword,
            userName,
         });
         responseReturn(res,200, user);
         return;
      } catch (error) {
         responseReturn(res,401, error);
      }
   }

   //end
refreshToken = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        responseReturn(res, 400, { error: "Refresh token is required" });
        return;
    }
    try {
        const user = await User.findOne({ refreshTokens: refreshToken });
        if (!user) {
            responseReturn(res, 400, { error: "Invalid refresh token" });
            return;
        }
        const newAccessToken = await createToken({ id: user._id }, "1h");
        responseReturn(res, 200, { token: newAccessToken });
    } catch (error) {
        responseReturn(res, 500, { error: "Internal server error" });
    }
}

    logout = async (req: Request, res: Response): Promise<void> => {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            responseReturn(res, 400, { error: "Refresh token is required" });
            return;
        }
        try {
            const user = await User.findOne({ refreshTokens: refreshToken });
            if (!user) {
                responseReturn(res, 400, { error: "Invalid refresh token" });
                return;
            }
            user.refreshTokens =(user.refreshTokens as string[]).filter(token => token !== refreshToken);
            await user.save();
            responseReturn(res, 200, { message: "Logout successful" });
        } catch (error) {
            responseReturn(res, 500, { error: "Internal server error" });
        }
    }

}
export default new authControllers();
