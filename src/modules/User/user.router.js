import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import * as userController from "./controller/user.js";
import { endPoint } from "./endPoint.auth.js";
import { fileUpload, fileValidation } from "../../utils/Multer.js";

const router = Router();

router.get("/", auth(endPoint.profile), userController.profile);

router.get("/:id/profile", userController.shareProfile);

router.post(
  "/profilePic",
  auth(endPoint.profile),
  fileUpload("user/profile", fileValidation.image).single("image"),
  userController.profilePic
);

router.get("/logout", auth(endPoint.profile), userController.logout);

export default router;
