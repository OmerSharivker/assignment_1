import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as jwt.JwtPayload;
        req.body.userId = decoded.id;
       
        return next();
       
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;