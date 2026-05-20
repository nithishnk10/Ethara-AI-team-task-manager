const express = require("express");

const router = express.Router();
const Task = require("../models/Task");

const authMiddleware = require("../middleware/authMiddleware");

const adminMiddleware = require("../middleware/adminMiddleware");

const {
    createTask,
    getTasks,
    getTasksByProject,
    updateTaskStatus,
    deleteTask
} = require("../controllers/taskController");

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    createTask
);

router.get(
    "/",
    authMiddleware,
    getTasks
);

router.get(
    "/project/:projectId",
    authMiddleware,
    getTasksByProject
);

router.put(
    "/:id",
    authMiddleware,
    updateTaskStatus
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteTask
);

module.exports = router;