const Task = require("../models/Task");

const getDashboardData = async (req, res) => {

    try {

        const totalTasks = await Task.countDocuments();

        const completedTasks = await Task.countDocuments({
            status: "Done"
        });

        const pendingTasks = await Task.countDocuments({
            status: {
                $ne: "Done"
            }
        });

        const overdueTasks = await Task.countDocuments({
            dueDate: {
                $lt: new Date()
            },
            status: {
                $ne: "Done"
            }
        });
        const tasksPerUser = await Task.aggregate([

            {
                $group: {
                    _id: "$assignedTo",
                    totalTasks: { $sum: 1 }
                }
            }

        ]);
        const User = require("../models/User");

        const populatedTasksPerUser =
            await Promise.all(

                tasksPerUser.map(async (item) => {

                    const user = await User.findById(
                        item._id
                    );

                    return {

                        name: user?.name,

                        totalTasks: item.totalTasks

                    };

                })

            );

        res.status(200).json({
            totalTasks,
            completedTasks,
            pendingTasks,
            overdueTasks,
            tasksPerUser: populatedTasksPerUser
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = { getDashboardData };