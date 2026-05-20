import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

function Dashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const token = localStorage.getItem("token");

    const [dashboardData, setDashboardData] = useState({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        overdueTasks: 0
    });
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);

    const [projectTitle, setProjectTitle] = useState("");
    const [projectForms, setProjectForms] = useState({});


    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const response = await API.get(
                    "/dashboard",
                    {
                        headers: {
                            Authorization: token
                        }
                    }
                );

                setDashboardData(response.data);

            } catch (error) {

                console.log(error);

            }

        };


        const fetchProjects = async () => {

            try {

                const response = await API.get(
                    "/projects",
                    {
                        headers: {
                            Authorization: token
                        }
                    }
                );
                const projectsWithTasks = await Promise.all(

                    response.data.map(async (project) => {

                        const taskResponse = await API.get(
                            `/tasks/project/${project._id}`,
                            {
                                headers: {
                                    Authorization: token
                                }
                            }
                        );

                        return {

                            ...project,

                            tasks: taskResponse.data

                        };

                    })

                );

                setProjects(projectsWithTasks);

            } catch (error) {

                console.log(error);

            }

        };

        const fetchUsers = async () => {

            try {

                const response = await API.get(
                    "/auth/users",
                    {
                        headers: {
                            Authorization: token
                        }
                    }
                );

                setUsers(response.data);

            } catch (error) {

                console.log(error);

            }

        };

        fetchDashboard();

        fetchProjects();

        fetchUsers();

    }, []);

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");

    };
   
    const createTask = async (
        e,
        projectId
    ) => {

        e.preventDefault();

        try {

            const formData =
                projectForms[projectId];

            await API.post(
                "/tasks",
                {
                    title: formData.title,
                    description: formData.description,
                    dueDate: formData.dueDate,
                    priority: formData.priority,
                    assignedTo: formData.assignedTo,
                    project: projectId
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            alert("Task created");

            window.location.reload();

        } catch (error) {

            console.log(error);

        }

    };
    const createProject = async (e) => {

        e.preventDefault();

        try {

            await API.post(
                "/projects",
                {
                    title: projectTitle
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            alert("Project created");

            window.location.reload();

        } catch (error) {

            console.log(error);

        }

    };
    const addMember = async (projectId) => {

        try {

            const email =
                projectForms[projectId]?.memberEmail;

            await API.put(
                `/projects/${projectId}/add-member`,
                { email },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            alert("Member added");

            window.location.reload();

        } catch (error) {

            console.log(error);

        }

    };
    const removeMember = async (
        projectId,
        userId
    ) => {

        try {

            await API.put(
                `/projects/${projectId}/remove-member`,
                { userId },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            alert("Member removed");

            window.location.reload();

        } catch (error) {

            console.log(error);

        }

    };
    const handleProjectFormChange = (
        projectId,
        field,
        value
    ) => {

        setProjectForms((prev) => ({

            ...prev,

            [projectId]: {

                ...prev[projectId],

                [field]: value

            }

        }));

    };

    return (

        <div className="min-h-screen bg-linear-to-r from-blue-100 to-indigo-100">

            {/* Navbar */}

            <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-lg">

                <h1 className="text-2xl font-bold">
                    Team Task Manager
                </h1>

                <div className="flex gap-4">

                    <button
                        onClick={() =>
                            document.getElementById("projects")
                            .scrollIntoView({ behavior: "smooth" })
                        }
                        className="bg-green-500 px-4 py-2 rounded-lg"
                    >
                        Projects
                    </button>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                        Logout
                    </button>

                </div>

            </div>

            {/* Main Content */}

            <div className="p-6">

                <div className="mb-6">

                    <h2 className="text-3xl font-bold">
                        Welcome {user?.name}
                    </h2>

                    <p className="text-gray-600">
                        Role: {user?.role}
                    </p>

                </div>
                <div id="projects" className="mb-10">

                    <div className="flex justify-between items-center mb-6">

                        <h2 className="text-2xl font-bold">
                            Projects
                        </h2>

                    </div>

                    {/* Create Project */}

                    <form
                        onSubmit={createProject}
                        className="bg-white p-6 rounded-2xl shadow-md mb-6 flex gap-4"
                    >

                        <input
                            type="text"
                            placeholder="Project Title"
                            value={projectTitle}
                            onChange={(e) =>
                                setProjectTitle(e.target.value)
                            }
                            className="border p-3 rounded-lg flex-1"
                        />

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 rounded-lg"
                        >
                            Create Project
                        </button>

                    </form>

                    {/* Project Cards */}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {projects.map((project) => (

                            <div
                                key={project._id}
                                className="bg-white p-6 rounded-2xl shadow-md"
                            >

                                <h3 className="text-xl font-bold">
                                    {project.title}
                                </h3>

                                <p className="text-gray-600 mt-2">
                                    Project Management Workspace
                                </p>
                                <div className="mt-4">

                                    <select
                                        value={
                                            projectForms[project._id]?.memberEmail || ""
                                        }
                                        onChange={(e) =>
                                            handleProjectFormChange(
                                                project._id,
                                                "memberEmail",
                                                e.target.value
                                            )
                                        }
                                        className="border p-2 rounded-lg w-full mb-2"
                                    >

                                        <option value="">
                                            Select Member
                                        </option>

                                        {users
                                            .filter(
                                                (user) =>
                                                    !project.members.some(
                                                        (member) =>
                                                            member._id === user._id
                                                    )
                                            )
                                            .map((user) => (

                                                <option
                                                    key={user._id}
                                                    value={user.email}
                                                >
                                                    {user.name}
                                                </option>

                                            ))}

                                    </select>

                                    <button
                                        onClick={() =>
                                            addMember(project._id)
                                        }
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
                                    >
                                        Add Member
                                    </button>

                                </div>
                                <div className="mt-4">

                                    <h4 className="font-bold mb-2">
                                        Members
                                    </h4>

                                    {project.members.map((member) => (

                                        <div
                                            key={member._id}
                                            className="flex justify-between items-center bg-gray-100 p-2 rounded-lg mb-2"
                                        >

                                            <span>
                                                {member.name}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    removeMember(
                                                        project._id,
                                                        member._id
                                                    )
                                                }
                                                className="bg-red-500 text-white px-3 py-1 rounded-lg"
                                            >
                                                Remove
                                            </button>

                                        </div>

                                    ))}

                                </div>
                                <div className="mt-6">

                                    <h3 className="text-lg font-bold mb-3">
                                        Create Task
                                    </h3>

                                    <form
                                        onSubmit={(e) =>
                                            createTask(e, project._id)
                                        }
                                        className="space-y-3"
                                    >

                                        <input
                                            type="text"
                                            placeholder="Task Title"
                                            onChange={(e) =>
                                                handleProjectFormChange(
                                                    project._id,
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                            className="border p-2 rounded-lg w-full"
                                        />

                                        <input
                                            type="text"
                                            placeholder="Description"
                                            onChange={(e) =>
                                                handleProjectFormChange(
                                                    project._id,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            className="border p-2 rounded-lg w-full"
                                        />

                                        <input
                                            type="date"
                                            onChange={(e) =>
                                                handleProjectFormChange(
                                                    project._id,
                                                    "dueDate",
                                                    e.target.value
                                                )
                                            }
                                            className="border p-2 rounded-lg w-full"
                                        />

                                        <select
                                            onChange={(e) =>
                                                handleProjectFormChange(
                                                    project._id,
                                                    "priority",
                                                    e.target.value
                                                )
                                            }
                                            className="border p-2 rounded-lg w-full"
                                        >

                                            <option value="Low">
                                                Low
                                            </option>

                                            <option value="Medium">
                                                Medium
                                            </option>

                                            <option value="High">
                                                High
                                            </option>

                                        </select>

                                        {/* Assign Member */}

                                        <select
                                            onChange={(e) =>
                                                handleProjectFormChange(
                                                    project._id,
                                                    "assignedTo",
                                                    e.target.value
                                                )
                                            }
                                            className="border p-2 rounded-lg w-full"
                                        >

                                            <option value="">
                                                Assign Member
                                            </option>

                                            {project.members.map((member) => (

                                                <option
                                                    key={member._id}
                                                    value={member._id}
                                                >
                                                    {member.name}
                                                </option>

                                            ))}

                                        </select>

                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
                                        >
                                            Create Task
                                        </button>

                                    </form>

                                </div>
                                <div className="mt-6">

                                    <h3 className="text-lg font-bold mb-3">
                                        Project Tasks
                                    </h3>

                                    <div className="space-y-4">

                                        {project.tasks?.map((task) => (

                                            <div
                                                key={task._id}
                                                className="bg-gray-100 p-4 rounded-xl"
                                            >

                                                <h4 className="font-bold">
                                                    {task.title}
                                                </h4>

                                                <p className="text-gray-600">
                                                    {task.description}
                                                </p>

                                                <p className="mt-2">
                                                    Assigned To:
                                                    {" "}
                                                    <span className="font-semibold">
                                                        {task.assignedTo?.name}
                                                    </span>
                                                </p>

                                                <p>
                                                    Status:
                                                    {" "}
                                                    <span className="font-semibold">
                                                        {task.status}
                                                    </span>
                                                </p>

                                                <p>
                                                    Priority:
                                                    {" "}
                                                    <span className="font-semibold">
                                                        {task.priority}
                                                    </span>
                                                </p>

                                            </div>

                                        ))}

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

                {/* Cards */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    <div className="bg-white p-6 rounded-2xl shadow-md">

                        <h3 className="text-lg font-semibold text-gray-600">
                            Total Tasks
                        </h3>

                        <p className="text-4xl font-bold text-blue-600 mt-2">
                            {dashboardData.totalTasks}
                        </p>

                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-md">

                        <h3 className="text-lg font-semibold text-gray-600">
                            Completed
                        </h3>

                        <p className="text-4xl font-bold text-green-600 mt-2">
                            {dashboardData.completedTasks}
                        </p>

                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-md">

                        <h3 className="text-lg font-semibold text-gray-600">
                            Pending
                        </h3>

                        <p className="text-4xl font-bold text-yellow-500 mt-2">
                            {dashboardData.pendingTasks}
                        </p>

                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-md">

                        <h3 className="text-lg font-semibold text-gray-600">
                            Overdue
                        </h3>

                        <p className="text-4xl font-bold text-red-500 mt-2">
                            {dashboardData.overdueTasks}
                        </p>

                    </div>

                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md mt-8">

                    <h2 className="text-2xl font-bold mb-4">
                        Tasks Per User
                    </h2>

                    <div className="space-y-3">

                        {dashboardData.tasksPerUser?.map(
                            (user, index) => (

                                <div
                                    key={index}
                                    className="flex justify-between bg-gray-100 p-3 rounded-lg"
                                >

                                    <span className="font-semibold">
                                        {user.name}
                                    </span>

                                    <span>
                                        {user.totalTasks} Tasks
                                    </span>

                                </div>

                            )
                        )}

                    </div>

                </div>
                             
                <div className="text-center py-6 text-gray-600">

                    Team Task Manager © 2026

                </div>

            </div>

        </div>

    );
}

export default Dashboard;