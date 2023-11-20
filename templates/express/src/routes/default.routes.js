import express from "express";

import defaultController from "../controllers/defaultController.js";

const router = express.Router();

router.get("/", defaultController);

export default router;
