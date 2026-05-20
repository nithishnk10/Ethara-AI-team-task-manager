import { useEffect, useState } from "react";

import API from "../services/api";

function MemberDashboard() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const token = localStorage.getItem("token");

    const [projects, setProjects] = useState([]);

    useEffect(() => {

        const fetchProjects = async () => {

            try {

                // Get assigned projects
                const projectResponse = await API.get(
                    "/projects",
                    {
                        headers: {
                            Authorization: token
                        }
                    }
                );

                // Fetch tasks for each project
                const projectsWithTasks =
                    await Promise.all(

                        projectResponse.data.map(
                            async (project) => {

                                const taskResponse =
                                    await API.get(
                                        `/tasks/project/${project._id}`,
                                        {
                                            headers: {
                                                Authorization: token
                                            }
                                        }
                                    );

                                return {

                                    ...project,

                                    tasks:
                                        taskResponse.data

                                };

                            }
                        )

                    );

                setProjects(projectsWithTasks);

            } catch (error) {

                console.log(error);

            }

        };

        fetchProjects();

    }, []);

    const updateTaskStatus = async (
        taskId,
        status
    ) => {

        try {

            await API.put(
                `/tasks/${taskId}`,
                { status },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === taskId
                        ? { ...task, status }
                        : task
                )
            );

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="min-h-screen bg-linear-to-r from-green-100 to-blue-100 p-6">

            <h1 className="text-3xl font-bold mb-2">
                Member Dashboard
            </h1>

            <p className="text-gray-600 mb-8">
                Welcome {user?.name}
            </p>

            <div className="space-y-8">

                {projects.map((project) => (

                    <div
                        key={project._id}
                        className="bg-white p-6 rounded-2xl shadow-md"
                    >

                        <h2 className="text-2xl font-bold mb-2">
                            {project.title}
                        </h2>

                        <p className="text-gray-600 mb-6">
                            Assigned Project Workspace
                        </p>

                        <h3 className="text-xl font-bold mb-4">
                            My Tasks
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {project.tasks?.map((task) => (

                                <div
                                    key={task._id}
                                    className="bg-gray-100 p-4 rounded-xl"
                                >

                                    <h4 className="font-bold text-lg">
                                        {task.title}
                                    </h4>

                                    <p className="text-gray-600">
                                        {task.description}
                                    </p>

                                    <p className="mt-2">
                                        Priority:
                                        {" "}
                                        <span className="font-semibold">
                                            {task.priority}
                                        </span>
                                    </p>

                                    <p className="mt-2">

                                        <span className="font-semibold">
                                            Status:
                                        </span>

                                        <select
                                            value={task.status}
                                            onChange={(e) =>
                                                updateTaskStatus(
                                                    task._id,
                                                    e.target.value
                                                )
                                            }
                                            className="ml-2 border rounded-lg p-1"
                                        >

                                            <option value="To Do">
                                                To Do
                                            </option>

                                            <option value="In Progress">
                                                In Progress
                                            </option>

                                            <option value="Done">
                                                Done
                                            </option>

                                        </select>

                                    </p>

                                </div>

                            ))}

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );
}

export default MemberDashboard;