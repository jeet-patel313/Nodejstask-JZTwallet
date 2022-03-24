import { Router } from 'express';
const router = Router();
import {
  transferAmount,
  getAllTransaction,
  getTransaction,
} from '../services/transfer.js';
import verify from './verifyToken.js';

router.post('/', verify, transferAmount);

router.get('/all', verify, getAllTransaction);

router.get('/all/:postId', verify, getTransaction);

export default router;