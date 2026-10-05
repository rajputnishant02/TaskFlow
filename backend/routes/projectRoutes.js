const express = require("express")
const projectController = require("../controllers/projectController")
const authMiddleware = require("../middlewares/authMiddleware")

const projectRouter = express.Router();

projectRouter.post("/", authMiddleware, projectController.CreateProject);
projectRouter.get("/", authMiddleware, projectController.getProject);
projectRouter.put("/:id", authMiddleware, projectController.updateProject);
projectRouter.delete("/:id", authMiddleware, projectController.deleteProject);

module.exports = projectRouter;