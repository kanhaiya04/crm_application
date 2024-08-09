import { Router, Request, Response } from "express";
import passport from "passport";

const router = Router();

const url = process.env.FRONTEND_ORIGIN;
// Auth with Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

// Google auth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req: Request, res: Response) => {
    res.redirect(url ? url : "http://localhost:3000"); // Redirect to a protected route or dashboard
  }
);

router.get("/verify-session", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.clearCookie("connect.sid"); // Clears the session cookie
      res.status(200).json({ success: true });
    });
  });
});

export default router;
