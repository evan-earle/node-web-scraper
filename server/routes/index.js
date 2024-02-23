import express from "express";
import { scrape } from "../controllers/scrape.js";
import { scrapeAll } from "../controllers/scrapeAll.js";

const router = express.Router();

router.get("/scrape", scrape);
router.get("/scrapeAll", scrapeAll);

export default router;
