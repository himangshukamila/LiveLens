

// routes/images.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadImage } from "../controllers/imagesController.js";

const router = express.Router();
router.post("/upload", authMiddleware, uploadImage);
export default router;