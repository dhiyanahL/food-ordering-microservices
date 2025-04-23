const express = require("express");
const passport = require("passport");
const {
  registerUser,
  loginUser,
  googleCallback,
  facebookCallback,
  logoutUser,
} = require("../controllers/authController");

const router = express.Router();

// PUBLIC ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

// OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  facebookCallback
);

module.exports = router;
