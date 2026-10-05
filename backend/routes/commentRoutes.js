const express = require("express")
const commentController = require("../controllers/commentController")
const authMiddleware = require("../middlewares/authMiddleware")

const commentRoutes = express.Router();

commentRoutes.post("/", authMiddleware, commentController.createComment);

commentRoutes.get("/issue/:issueId", authMiddleware, commentController.getIssue)

module.exports = commentRoutes;
