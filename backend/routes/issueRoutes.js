const express = require("express")
const issueController = require("../controllers/issueController")
const authMiddleware = require("../middlewares/authMiddleware")

const issueRoutes = express.Router();

issueRoutes.post("/", authMiddleware, issueController.createIssue)

issueRoutes.get("/project/:projectId", authMiddleware, issueController.getIssue)

issueRoutes.put("/:id", authMiddleware, issueController.updateIssue)

issueRoutes.delete("/:id", authMiddleware, issueController.deleteIssue)

module.exports = issueRoutes;