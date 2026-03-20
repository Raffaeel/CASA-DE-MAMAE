import express from "express";

import { createPix } from "../controller/paymentController.js";

const router = express.Router();

router.post("/pix", createPix);

export default router;