const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const adminMiddleware = require("../middleware/adminMiddleware");

const {
    createTask,
    getTasks,
    getTasksByProject,
    updateTaskStatus
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

module.exports = router;