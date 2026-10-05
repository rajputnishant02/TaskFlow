const Comment = require("../models/Comment")
const Issue = require("../models/Issue")

const createComment = async (req, res) => {
    try {
        const { text, issueId } = req.body;

        if (!text || !issueId) {
            return res.status(400).json({
                message: "Comment text and issue are required"
            });
        }
        const issue = await Issue.findOne({ _id: issueId, createdBy: req.user })

        if (!issue) {
            return res.status(400).json({
                message: "issue does not exist"
            });
        }

        const comment = await Comment.create({
            text,
            issue: issue._id,
            user: req.user
        });

        return res.status(200).json({
            message: "Comment added successfully",
            comment
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "server error"
        })
    }

}

const getIssue = async (req, res) => {
    try {
        const { issueId } = req.params;

        const issue = await Issue.findById(issueId)

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        const comment = await Comment.find({
            issue: issueId
        })
            .populate("user", "name email")
            .sort({ createdAt: -1 })

        return res.status(200).json({
            message: "Comments fetch successfully",
            comment
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "server error"
        });
    }

}

module.exports = { createComment, getIssue };