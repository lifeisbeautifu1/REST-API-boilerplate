import express from 'express';

const router = express.Router();

import {
  getPosts,
  getPost,
  createPost,
  deletePost,
  likePost,
  commentOnPost,
  deleteCommentOnPost,
} from '../controllers/posts';

router.get('/', getPosts);

router.get('/:id', getPost);

router.post('/', createPost);

router.delete('/:id', deletePost);

router.patch('/:id', likePost);

router.post('/:id/comment', commentOnPost);

router.delete('/:id/comment', deleteCommentOnPost);

export default router;
