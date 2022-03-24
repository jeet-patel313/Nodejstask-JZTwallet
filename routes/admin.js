import path from 'path';
import { Router } from 'express';
import { registerAdmin } from '../controllers/auth.js';

const router = Router();

router.post('/register', registerAdmin);

export default router;