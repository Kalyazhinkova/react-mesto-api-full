import { Router } from 'express';
import {
  create, login,
} from '../controllers/users.js';
import {
  celebrateBodyAuth,
  celebrateBodyUser,
} from '../validators/users.js';

export const router = Router();

router.post('/signin', celebrateBodyAuth, login);
router.post('/signup', celebrateBodyUser, create);
