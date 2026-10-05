const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes")
const issueRoutes = require("./routes/issueRoutes")
const commentRoutes = require("./routes/commentRoutes")


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes)
app.use("/api/issues", issueRoutes)
app.use("/api/comments", commentRoutes)


app.get("/api/health", (req, res) => {
    res.json({
        message: "TaskFlow API is running"
    });
});

module.exports = app;