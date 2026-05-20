const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    createProject,
    getProjects,
    addMemberToProject,
    removeMemberFromProject
} = require("../controllers/projectController");

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    createProject
);

router.get("/", authMiddleware, getProjects);
router.put(
    "/:id/add-member",
    authMiddleware,
    adminMiddleware,
    addMemberToProject
);
router.put(
    "/:id/remove-member",
    authMiddleware,
    adminMiddleware,
    removeMemberFromProject
);

module.exports = router;