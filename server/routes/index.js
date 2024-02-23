import express from "express";
import { scrape } from "../controllers/scrape.js";

const router = express.Router();

router.get("/scrape", scrape);

export default router;
