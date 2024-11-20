import { Request, Response } from 'express';
import { Types } from 'mongoose';
import {responseReturn}  from '../utils/response';
import commentsModel from '../models/commentsModel';
import User from '../models/userModel';
import { find } from '../../node_modules/rxjs/dist/esm/internal/operators/find';
import bcrypt from 'bcrypt';

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
        responseReturn(res,400,{message : "login ok"})

     } catch (error) {
        responseReturn(res,500,{error : "internal server error"})
     }
}

}
export default new authControllers();
