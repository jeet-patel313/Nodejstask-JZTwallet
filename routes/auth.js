import path from 'path';
import { Router } from 'express';
import { registerUser, loginUser } from '../services/auth.js';

const router = Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

export default router;