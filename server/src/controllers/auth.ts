import { StatusCodes } from 'http-status-codes';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import {
  validateLoginInput,
  validateRegisterInput,
} from '../config/validators';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const { errors, valid } = validateLoginInput(username, password);
  if (!valid) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors });
  }
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      username: `User with username ${username} doesn't exist`,
    });
  } else {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        password: `Incorrect password`,
      });
    } else {
      const token = jwt.sign(
        {
          id: user._id,
          username,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        }
      );
      res.status(StatusCodes.OK).json({
        id: user._id,
        username: user.username,
        email: user.email,
        token,
      });
    }
  }
};

export const register = async (req: Request, res: Response) => {
  const { username, email, password, confirmPassword } = req.body;
  const { errors, valid } = validateRegisterInput(
    username,
    email,
    password,
    confirmPassword
  );
  if (!valid) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors });
  }
  let user = await User.findOne({ username });
  if (user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      username: `User with username ${username} already exist`,
    });
  } else {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    user = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    const token = jwt.sign(
      {
        id: user._id,
        username,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
    res.status(StatusCodes.OK).json({
      id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  }
};
