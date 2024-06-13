import express from "express";
import { getProjectResults } from '../controllers/results.controller.js';

const router = express.Router();
router.get('/getResults/:name', getProjectResults);

export default router;
