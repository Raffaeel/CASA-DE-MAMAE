


import express from "express";
import { createOrder } from "../controller/order.controller.js";

const orderRoute = express.Router();

orderRoute.post("/", createOrder);

export default orderRoute;