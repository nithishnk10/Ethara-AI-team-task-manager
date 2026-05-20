import {
    FaTasks,
    FaSignOutAlt,
    FaProjectDiagram
} from "react-icons/fa";
import { useEffect, useState } from "react";

import API from "../services/api";
import {
    useNavigate
} from "react-router-dom";
import { toast } from "react-toastify";

function MemberDashboard() {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/login");

    };
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const token = localStorage.getItem("token");

    const [projects, setProjects] = useState([]);

    const fetchProjects = async () => {

        try {

            const projectResponse =
                await API.get(
                    "/projects",
                    {
                        headers: {
                            Authorization: token
                        }
                    }
                );

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

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );

        }

    };

    useEffect(() => {

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

            toast.success(
                "✅ Task Status Updated"
            );

            await fetchProjects();

        } catch (error) {

            toast.error(
                "❌ Failed To Update Status"
            );

        }

    };
    return (

        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}

            <div className="w-64 bg-indigo-900 text-white p-6 shadow-xl">

                <h1 className="text-3xl font-bold mb-10">
                    Member Panel
                </h1>

                <div className="space-y-6">

                    <button
                        onClick={() =>
                            document.getElementById("projects")
                            .scrollIntoView({
                                behavior: "smooth"
                            })
                        }
                        className="flex items-center gap-3 hover:text-yellow-300"
                    >

                        <FaProjectDiagram />

                        Projects

                    </button>

                    <button
                        onClick={() =>
                            document.getElementById("tasks")
                            .scrollIntoView({
                                behavior: "smooth"
                            })
                        }
                        className="flex items-center gap-3 hover:text-yellow-300"
                    >

                        <FaTasks />

                        Tasks

                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 hover:text-red-300"
                    >

                        <FaSignOutAlt />

                        Logout

                    </button>

                </div>

            </div>
            <div className="flex-1 p-8 overflow-y-auto">
            <h1 className="text-3xl font-bold mb-2">
                Member Dashboard
            </h1>

            <p className="text-gray-600 mb-8">
                Welcome {user?.name}
            </p>

            <div  id="projects"
                className="space-y-8">

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

                        <div  id="tasks"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

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
    
    </div>
    );
}

export default MemberDashboard;