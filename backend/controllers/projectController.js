const Project = require("../models/Project")

const CreateProject = async (req, res) => {
    try {
        const { name, key, sprint } = req.body;

        if (!name || !key) {
            return res.status(400).json({
                message: "Project name and key are required"
            });
        }

        const project = await Project.create({
            name,
            key,
            sprint,
            owner: req.user
        });

        return res.status(201).json({
            message: "Project created successfully",
            project
        });
    } catch (error) {
        return res.status(500).json({
            message: "server error"
        });
    }

}

const getProject = async (req, res) => {
    try {
        const projects = await Project.find({
            owner: req.user
        });

        return res.status(200).json({
            projects
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "server error"
        })
    }
}

const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, key, sprint } = req.body;

        const project = await Project.findOne({
            _id: id,
            owner: req.user
        })

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            })
        }

        project.name = name ?? project.name;
        project.key = key ?? project.key;
        project.sprint = sprint ?? project.sprint;

        await project.save();

        return res.status(200).json({
            message: "Project updated successfully",
            project
        });

    } catch (error) {
        return res.status(500).json({
            status: "server error"
        })
    }
}

const deleteProject = (req, res) => {
    try {
        const { id } = req.params;

        const project = Project.findOneAndDelete({
            _id: id,
            owner: req.user
        })

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        return res.status(200).json({
            message: "Project deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
}

module.exports = { CreateProject, getProject, updateProject, deleteProject }