import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

// Register
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

// Login
router.route("/login").post(loginUser);

// Refresh Access Token
router.route("/refresh-token").post(refreshAccessToken);

// Logout
router.route("/logout").post(verifyJWT, logoutUser);

// Get Logged-in User
router.route("/me").get(verifyJWT, getCurrentUser);

// Change Password
router.route("/change-password").patch(verifyJWT, changeCurrentPassword);

// Update Account Details
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

// Update Avatar
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

export default router;
