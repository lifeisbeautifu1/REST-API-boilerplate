import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UnauthorizedError } from '../errors';
import jwt from 'jsonwebtoken';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer')) {
      throw new UnauthorizedError('Token not provided');
    } else {
      const token = authorization.split(' ')[1];
      let user = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
        username: string;
      };
      req.user = user;
      next();
    }
  } catch (error: any) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: error.message });
  }
};
