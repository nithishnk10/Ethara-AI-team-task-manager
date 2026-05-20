const Project = require("../models/Project");
const Task = require("../models/Task");

const createProject = async (req, res) => {

    try {

        const { title, description } = req.body;

        const newProject = new Project({
            title,
            description,
            createdBy: req.user.id,
            members: [req.user.id]
        });

        await newProject.save();

        res.status(201).json({
            message: "Project created successfully",
            project: newProject
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const getProjects = async (req, res) => {

    try {

        let projects;

        // Admin sees all projects
        if (req.user.role === "admin") {

            projects = await Project.find()
                .populate("createdBy", "name email")
                .populate("members", "name email");

        }

        // Members see only assigned projects
        else {

            projects = await Project.find({
                members: req.user.id
            })
            .populate("createdBy", "name email")
            .populate("members", "name email");

        }

        res.status(200).json(projects);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const addMemberToProject = async (req, res) => {

    try {

        const { email } = req.body;

        const projectId = req.params.id;

        const User = require("../models/User");

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        // Find project
        const project = await Project.findById(projectId);

        // Prevent duplicate member
        if (
            project.members.includes(user._id)
        ) {

            return res.status(400).json({
                message: "User already member"
            });

        }

        // Add member
        const alreadyMember =
            project.members.includes(user._id);

        if (alreadyMember) {

            return res.status(400).json({
                message: "User already in project"
            });

        }
        project.members.push(user._id);

        await project.save();

        res.status(200).json({
            message: "Member added successfully",
            project
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const removeMemberFromProject = async (req, res) => {

    try {

        const { userId } = req.body;

        const projectId = req.params.id;

        const project = await Project.findById(projectId);

        project.members = project.members.filter(
            (memberId) =>
                memberId.toString() !== userId
        );

        await project.save();

        res.status(200).json({
            message: "Member removed successfully",
            project
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const deleteProject = async (
    req,
    res
) => {

    try {

        // Delete all tasks related to project

        await Task.deleteMany({
            project: req.params.id
        });

        // Delete project

        await Project.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            message:
                "Project and tasks deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};
module.exports = {
    createProject,
    getProjects,
    addMemberToProject,
    removeMemberFromProject,
    deleteProject
};