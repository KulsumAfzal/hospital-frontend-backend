import express from "express";
import {getAllMessages, sendMessage} from "../controller/messageController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

//creating instance of a router
const router = express.Router();

router.post("/send", sendMessage);
router.get("/getall", isAdminAuthenticated, getAllMessages)

export default router;