const express = require("express");

const router = express.Router();

const { signup, login, getUsers } = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");


router.post("/signup", signup);

router.post("/login", login);

router.get(
    "/users",
    authMiddleware,
    getUsers
);

router.get("/profile", authMiddleware, (req, res) => {

    res.json({
        message: "Protected route accessed",
        user: req.user
    });

});

module.exports = router;