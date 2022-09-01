import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string,
  email: string
};

//augment the Request type with definition for currentUser 
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload
    }
  }
}

//middleware fn to extract jwt payload and set to req.currentUser
export const currentUser = async (req:Request, res: Response, next: NextFunction) => {
  if(!req.session?.jwt) {
    next();
  };
  
  try {
    const payload = jwt.verify(req.session?.jwt, process.env.JWT_KEY!) as UserPayload;
    req.currentUser = payload
  } catch(err){ console.log(err) };

  next();
}