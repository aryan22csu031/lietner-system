const express = require("express");
const { register, login, logout } = require("../controllers/Auth.controller");
const AuthMiddleware = require("../middleware/Auth.middleware");
const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/check", AuthMiddleware, (req, res) => {
  res.json({ message: "You are authenticated" });
});

module.exports = authRouter;
