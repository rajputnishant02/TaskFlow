const Issue = require("../models/Issue")
const Project = require("../models/Project")

const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("name email");

        return res.status(200).json({
            users
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to fetch users"
        });
    }
};

const createIssue = async (req, res) => {
    try {
        const {
            issueKey,
            title,
            description,
            priority,
            assignee,
            project,
            sprint,
            labels
        } = req.body;

        if (!title || !issueKey || !project) {
            return res.status(400).json({
                message: "Issue key, title and project are required"
            });
        }

        const existingProject = await Project.findOne({
            _id: project,
            owner: req.user
        });

        if (!existingProject) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        const issue = await Issue.create({
            issueKey,
            title,
            description,
            priority,
            assignee,
            project,
            sprint,
            labels,
            createdBy: req.user
        });

        return res.status(201).json({
            message: "Issue created successfully",
            issue
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "server error"
        });
    }

}

const getIssue = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findOne({
            _id: projectId,
            owner: req.user
        })

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        const issues = await Issue.find({
            project: projectId
        })
            .populate("assignee", "name email")
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            message: "all issues fetched succesfully",
            issues
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "server error"
        })
    }

}

const updateIssue = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            status,
            priority,
            assignee,
            sprint,
            labels
        } = req.body;

        const issue = await Issue.findOne({
            _id: id,
            createdBy: req.user
        })



        if (!issue) {
            return res.status(400).json({
                message: "issue doesn't exist"
            })
        }

        issue.title = title ?? issue.title;
        issue.description = description ?? issue.description;
        issue.status = status ?? issue.status;
        issue.priority = priority ?? issue.priority;
        issue.assignee = assignee ?? issue.assignee;
        issue.sprint = sprint ?? issue.sprint;
        issue.labels = labels ?? issue.labels;

        await issue.save();

        return res.status(200).json({
            message: "Issue updated succesfully",
            issue
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "server error"
        });
    }
}

const deleteIssue = async (req, res) => {
    try {
        const { id } = req.params;

        const issue = await Issue.findOneAndDelete({
            _id: id,
            createdBy: req.user
        })

        if (!issue) {
            return res.status(400).json({
                message: "Issue doesn't exist"
            });
        }

        return res.status(400).json({
            message: "Issue deleted successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({

            message: "server error"
        })
    }
}

module.exports = { createIssue, getIssue, updateIssue, deleteIssue, getUsers }