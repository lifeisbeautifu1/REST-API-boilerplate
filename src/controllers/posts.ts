import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Post from '../models/post';
import Comment from '../models/comment';
import User from '../models/user';
import { BadRequestError, NotFoundError } from '../errors';

export const getPosts = async (req: Request, res: Response) => {
  let posts = await Post.find({});
  res.status(StatusCodes.OK).json(posts);
};

export const getPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  let post = await Post.findById(id)
    .populate('comments', 'body author')
    .populate('author', 'username');
  if (!post) throw new NotFoundError(`Post width id ${id} not found`);
  const newPost = await User.populate(post, {
    path: 'comments.author',
    select: 'username',
  });

  res.status(StatusCodes.OK).json(newPost);
};

export const createPost = async (req: Request, res: Response) => {
  const { body } = req.body;
  if (!body) {
    throw new BadRequestError('Post body must not empty!');
  }
  const post = await Post.create({
    body,
    author: req.user.id,
  });
  res.status(StatusCodes.OK).json(post);
};

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await Post.findById(req.params.id);
  if (!post) throw new NotFoundError(`Post width id ${id} not found`);
  await Post.remove();
  res.status(StatusCodes.OK).json({ message: 'Post has been deleted' });
};

export const likePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  let post = await Post.findById(id);
  if (!post) {
    if (!post) throw new NotFoundError(`Post width id ${id} not found`);
  } else {
    // @ts-ignore
    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter((id) => id != req.user.id);
    } else {
      // @ts-ignore
      post.likes.push(req.user.id);
    }
    await post.save();
    // post = await Post.findById(id);
    return res.status(StatusCodes.OK).json({ message: 'success' });
  }
};

export const commentOnPost = async (req: Request, res: Response) => {
  const { body } = req.body;
  if (!body) {
    throw new BadRequestError('Post body must not be empty!');
  }
  const { id } = req.params;
  const comment = await Comment.create({
    body,
    author: req.user.id,
  });
  const post = await Post.findByIdAndUpdate(
    id,
    {
      $push: {
        comments: comment,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate('comments', 'body author');
  const updatedPost = await User.populate(post, {
    path: 'comments.author',
    select: 'username',
  });
  res.status(StatusCodes.OK).json(updatedPost);
};

export const deleteCommentOnPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { commentId } = req.body;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new NotFoundError("Comment doesn't exist");
  } else {
    const post = await Post.findByIdAndUpdate(
      id,
      {
        $pull: {
          comments: commentId,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate('comments', 'body author');
    const updatedPost = await User.populate(post, {
      path: 'comments.author',
      select: 'username',
    });
    await comment.remove();
    res.status(StatusCodes.OK).json(updatedPost);
  }
};
