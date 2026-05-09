import { Router } from 'express';
import { TOKENS } from '../data/tokens.js';

const router = Router();

router.get('/', (_req, res) => res.json(TOKENS));

export default router;
