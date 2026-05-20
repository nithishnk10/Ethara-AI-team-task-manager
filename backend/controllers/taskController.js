const Task = require("../models/Task");

const createTask = async (req, res) => {

    try {

        const {
            title,
            description,
            dueDate,
            priority,
            project,
            assignedTo
        } = req.body;

        const newTask = new Task({
            title,
            description,
            dueDate,
            priority,
            project,
            assignedTo
        });

        await newTask.save();

        res.status(201).json({
            message: "Task created successfully",
            task: newTask
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const getTasks = async (req, res) => {

    try {

        let tasks;

        if (req.user.role === "admin") {

            tasks = await Task.find()
                .populate("project", "title")
                .populate("assignedTo", "name email");

        } else {

            tasks = await Task.find({
                assignedTo: req.user.id
            })
            .populate("project", "title")
            .populate("assignedTo", "name email");

        }

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const getTasksByProject = async (req, res) => {

    try {

        const tasks = await Task.find({
            project: req.params.projectId
        })
        .populate("assignedTo", "name email");

        res.status(200).json(tasks);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const updateTaskStatus = async (req, res) => {

    try {

        const { status } = req.body;

        // Find task first
        const task = await Task.findById(req.params.id);

        // Restrict members
        if (
            req.user.role !== "admin" &&
            task.assignedTo.toString() !== req.user.id
        ) {

            return res.status(403).json({
                message: "Not authorized"
            });

        }

        // Update task
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.status(200).json({
            message: "Task updated successfully",
            task: updatedTask
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    createTask,
    getTasks,
    getTasksByProject,
    updateTaskStatus
};