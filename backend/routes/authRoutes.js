const express = require("express")
const authController = require("../controllers/authController")
const authUser = require("../middlewares/authMiddleware")

const authRouter = express.Router();

authRouter.post("/register", authController.registerUser);

authRouter.post("/login", authController.loginUser)

authRouter.get("/me", authUser, authController.getCurrentUser);

authRouter.get(
    "/users",
    authUser,
    authController.getUsers
);


module.exports = authRouter;