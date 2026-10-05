const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
    {
        issueKey: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            upperCase: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "backlog",
                "todo",
                "in_progress",
                "in_review",
                "done"
            ],
            default: "backlog"
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            default: "medium"
        },

        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },

        sprint: {
            type: String,
            trim: true
        },

        labels: [
            {
                type: String,
                trim: true
            }
        ],

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    },
    {
        timestamps: true
    }
);

const Issue = mongoose.model("Issue", issueSchema)
module.exports = Issue;