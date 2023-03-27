import { Router } from "express";
import auth from "../../middleware/auth.middleware.js";
import { endPoint } from "../User/endPoint.auth.js";
import * as messageController from "./controller/message.js";
const router = Router();

router.post("/:id", messageController.sendMessage);

router.get(
  "/:id/delete",
  auth(endPoint.profile[1]),
  messageController.deleteMessage
);

export default router;
