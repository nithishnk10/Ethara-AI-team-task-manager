import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";
import {
    FaProjectDiagram,
    FaChartBar,
    FaSignOutAlt,
    FaTasks,
    FaCheckCircle,
    FaExclamationTriangle,
    FaUsers
} from "react-icons/fa";

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
    const [loading, setLoading] =
    useState(true);
    const [activeProjectId, setActiveProjectId] =
    useState(null);
    const [selectedProject, setSelectedProject] =
    useState(null);
    const [selectedMembers, setSelectedMembers] =
    useState({});
    const [projectForm, setProjectForm] =
        useState({
            title: ""
        });
    const handleProjectChange = (e) => {

        setProjectForm({
            ...projectForm,
            [e.target.name]: e.target.value
        });

    };

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

                toast.error(
                    error.response?.data?.message ||
                    "Something went wrong"
                );

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
                if (activeProjectId) {

                    const updatedProject =
                        projectsWithTasks.find(
                            (project) =>
                                project._id === activeProjectId
                        );

                    setSelectedProject(updatedProject);

                }
                setLoading(false);

            } catch (error) {
                setLoading(false);

                toast.error(
                    error.response?.data?.message ||
                    "Something went wrong"
                );

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

                toast.error(
                    error.response?.data?.message ||
                    "Something went wrong"
                );

            }

        };


    useEffect(() => {

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
                    title:
                        formData?.title,

                    description:
                        formData?.description,

                    dueDate:
                        formData?.dueDate,

                    priority:
                        formData?.priority,

                    assignedTo:
                        formData?.assignedTo,

                    project: projectId
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            toast.success(
                "Task created"
            );

            setProjectForms({

                ...projectForms,

                [projectId]: {

                    title: "",
                    description: "",
                    dueDate: "",
                    priority: "Low",
                    assignedTo: ""

                }

            });

            await fetchProjects();
            const dashboardResponse =
                await API.get(
                    "/dashboard",
                    {
                        headers: {
                            Authorization: token
                        }
                    }
                );

            setDashboardData(
                dashboardResponse.data
            );
            await fetchDashboard();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to create task"
            );

        }

    };
    const createProject = async (e) => {

        e.preventDefault();

        if (!projectForm.title.trim()) {

            return toast.error(
                "❌ Project title is required"
            );

        }

        try {
            console.log(projectForm);

            await API.post(
                "/projects",
                {
                    title: projectForm.title
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            toast.success("Project created");

            await fetchProjects();
            setProjectForm({
                title: ""
            });

            setSelectedMembers({});

            setProjectForms({});

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );

        }

    };
    const addMember = async () => {
        const projectId = activeProjectId;

        const email =
            selectedMembers[projectId];

        if (!email) {

            return toast.error(
                "❌ Select a member"
            );

        }

        try {

            const email =
                selectedMembers[projectId];

            await API.put(
                `/projects/${projectId}/add-member`,
                { email },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            toast.success("Member added");
            setSelectedMembers({
                ...selectedMembers,
                [activeProjectId]: ""
            });

            await fetchProjects();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );

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

            toast.success("Member removed");

            await fetchProjects();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );

        }

    };
const handleProjectFormChange = (
    e,
    projectId
) => {

    setProjectForms({

        ...projectForms,

        [projectId]: {

            ...projectForms[projectId],

            [e.target.name]:
                e.target.value

        }

    });

};
    const deleteTask = async (taskId) => {

        try {

            await API.delete(
                `/tasks/${taskId}`,
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            toast.success("Task deleted");

            await fetchProjects();
            const dashboardResponse =
                await API.get(
                    "/dashboard",
                    {
                        headers: {
                            Authorization: token
                        }
                    }
                );

            setDashboardData(
                dashboardResponse.data
            );
            await fetchDashboard();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );

        }

    };
    const deleteProject = async (
        projectId
    ) => {

        try {

            await API.delete(
                `/projects/${projectId}`,
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            toast.success("Project deleted");

            await fetchProjects();
            setSelectedMembers({});

            setProjectForms({});

            setSelectedProject(null);

            setActiveProjectId(null);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );

        }

    };
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
                "Task Status Updated"
            );

            await fetchProjects();
            await fetchDashboard();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed To Update Status"
            );

        }

    };




    return (

        <div className="flex min-h-screen bg-gray-100">

            {/* Sidebar */}

            <div className="w-72 bg-indigo-950 text-white flex flex-col justify-between p-6 shadow-2xl">

                <div>

                    <h1 className="text-3xl font-bold mb-12 tracking-wide">
                        TaskFlow
                    </h1>

                    <div className="space-y-5">

                        <button
                            onClick={() =>
                                document.getElementById("dashboard")
                                .scrollIntoView({
                                    behavior: "smooth"
                                })
                            }
                            className="flex items-center gap-3 text-lg hover:text-yellow-300 transition"
                        >
                            Dashboard
                        </button>

                        <button
                            onClick={() =>
                                document.getElementById("projects")
                                .scrollIntoView({
                                    behavior: "smooth"
                                })
                            }
                            className="flex items-center gap-3 text-lg hover:text-yellow-300 transition"
                        >
                            Projects
                        </button>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 text-lg hover:text-red-300 transition"
                        >
                            Logout
                        </button>

                    </div>

                </div>

                <div className="text-sm text-gray-300">
                    Team Task Manager © 2026
                </div>

            </div>

            {/* Main Content */}

            <div className="flex-1 p-10 overflow-y-auto">

                {/* Welcome Section */}

                <div className="mb-10">

                    <h1 className="text-5xl font-bold text-gray-800 mb-3">
                        Welcome {user?.name} 👋
                    </h1>

                    <p className="text-gray-600 text-lg">
                        Manage your projects and team productivity efficiently.
                    </p>

                </div>

                {/* Dashboard Cards */}

                <div
                    id="dashboard"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10"
                >

                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-7 rounded-3xl shadow-xl hover:scale-105 transition duration-300">

                        <p className="text-sm opacity-80">
                            Total Tasks
                        </p>

                        <h2 className="text-5xl font-bold mt-2">
                            {dashboardData.totalTasks}
                        </h2>

                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-7 rounded-3xl shadow-xl hover:scale-105 transition duration-300">

                        <p className="text-sm opacity-80">
                            Completed
                        </p>

                        <h2 className="text-5xl font-bold mt-2">
                            {dashboardData.completedTasks}
                        </h2>

                    </div>

                    <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-7 rounded-3xl shadow-xl hover:scale-105 transition duration-300">

                        <p className="text-sm opacity-80">
                            Overdue
                        </p>

                        <h2 className="text-5xl font-bold mt-2">
                            {dashboardData.overdueTasks}
                        </h2>

                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white p-7 rounded-3xl shadow-xl hover:scale-105 transition duration-300">

                        <p className="text-sm opacity-80">
                            Team Members
                        </p>

                        <h2 className="text-5xl font-bold mt-2">
                            {users.length}
                        </h2>

                    </div>

                </div>

                {/* Tasks Per User */}

                <div className="bg-white rounded-3xl shadow-lg p-8 mb-10 border border-gray-200">

                    <div className="flex justify-between items-center mb-6">

                        <h2 className="text-3xl font-bold text-gray-800">
                            Tasks Per User
                        </h2>

                    </div>

                    <div className="space-y-4">

                        {dashboardData.tasksPerUser?.map(
                            (user, index) => (

                                <div
                                    key={index}
                                    className="flex justify-between items-center bg-gray-50 border border-gray-100 p-5 rounded-2xl hover:shadow-md transition"
                                >

                                    <div>

                                        <h3 className="font-semibold text-lg text-gray-800">
                                            {user.name}
                                        </h3>

                                        <p className="text-gray-500 text-sm">
                                            Assigned Tasks
                                        </p>

                                    </div>

                                    <div className="bg-indigo-600 text-white px-5 py-2 rounded-full font-bold text-lg">
                                        {user.totalTasks}
                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </div>

                {/* Projects Section */}

                <div
                    id="projects"
                    className="mb-8 flex justify-between items-center"
                >

                    <div>

                        <h2 className="text-4xl font-bold text-gray-800">
                            Projects
                        </h2>

                        <p className="text-gray-500 mt-1">
                            Manage all active team projects.
                        </p>

                    </div>

                </div>

                {/* Create Project */}

                <div className="bg-white rounded-3xl shadow-lg p-6 mb-10 border border-gray-200">

                    <form
                        onSubmit={createProject}
                        className="flex flex-col md:flex-row gap-4"
                    >

                        <input
                            type="text"
                            name="title"
                            placeholder="Enter Project Name"
                            value={projectForm.title}
                            onChange={handleProjectChange}
                            className="flex-1 border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold transition"
                        >
                            Create Project
                        </button>

                    </form>

                </div>

                {/* Project Cards */}

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">

                    {projects.map((project) => (

                        <div
                            key={project._id}
                            className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition duration-300"
                        >

                            {/* Header */}

                            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6">

                                <div className="flex justify-between items-start">

                                    <div>

                                        <h2 className="text-3xl font-bold mb-2">
                                            {project.title}
                                        </h2>

                                        <p className="text-sm opacity-80">
                                            Team Collaboration Workspace
                                        </p>

                                    </div>

                                    <button
                                        onClick={() => {

                                            const confirmDelete =
                                                window.confirm(
                                                    "Delete this project?"
                                                );

                                            if (confirmDelete) {
                                                deleteProject(project._id);
                                            }

                                        }}
                                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl transition"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                            {/* Content */}

                            <div className="p-6">

                                {/* Members */}

                                <div className="mb-8">

                                    <h3 className="text-xl font-bold mb-4 text-gray-800">
                                        Team Members
                                    </h3>

                                    <div className="space-y-3">

                                        {project.members.map((member) => (

                                            <div
                                                key={member._id}
                                                className="flex justify-between items-center bg-indigo-50 border border-indigo-100 px-4 py-3 rounded-2xl"
                                            >

                                                <div>

                                                    <p className="font-semibold text-gray-800">
                                                        {member.name}
                                                    </p>

                                                    <p className="text-sm text-gray-500">
                                                        {member.email}
                                                    </p>

                                                </div>

                                                <button
                                                    onClick={() =>
                                                        removeMember(
                                                            project._id,
                                                            member._id
                                                        )
                                                    }
                                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
                                                >
                                                    Remove
                                                </button>

                                            </div>

                                        ))}

                                    </div>

                                </div>
                                
                                {/* Project Stats */}

                                <div className="grid grid-cols-2 gap-4 mt-6">

                                    <div className="bg-gray-50 p-4 rounded-2xl text-center">

                                        <p className="text-sm text-gray-500">
                                            Members
                                        </p>

                                        <h3 className="text-3xl font-bold text-indigo-600">
                                            {project.members.length}
                                        </h3>

                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-2xl text-center">

                                        <p className="text-sm text-gray-500">
                                            Tasks
                                        </p>

                                        <h3 className="text-3xl font-bold text-green-600">
                                            {project.tasks?.length || 0}
                                        </h3>

                                    </div>

                                </div>
                                {/* Progress */}

                                <div className="mt-6">

                                    <div className="flex justify-between mb-2">

                                        <span className="text-sm font-medium text-gray-600">
                                            Progress
                                        </span>

                                        <span className="text-sm font-semibold text-indigo-600">
                                            70%
                                        </span>

                                    </div>

                                    <div className="w-full bg-gray-200 rounded-full h-3">

                                        <div
                                            className="bg-indigo-600 h-3 rounded-full"
                                            style={{ width: "70%" }}
                                        >

                                        </div>

                                    </div>

                                </div>
                                <button
                                    onClick={() => {

                                        setSelectedProject(project);

                                        setActiveProjectId(project._id);

                                    }}
                                    className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-semibold transition"
                                >
                                    Open Project
                                </button>
                                
                            </div>

                        </div>

                    ))}

                </div>
                {/* Project Modal */}

                {selectedProject && (

                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">

                        <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8 relative">

                            {/* Close Button */}

                            <button
                                onClick={() =>
                                    setSelectedProject(null)
                                }
                                className="absolute top-5 right-5 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                            >
                                Close
                            </button>

                            {/* Project Title */}

                            <div className="mb-10">

                                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                                    {selectedProject.title}
                                </h1>

                                <p className="text-gray-500">
                                    Project Workspace Management
                                </p>

                            </div>

                            {/* Members */}

                            <div className="mb-10">

                                <h2 className="text-2xl font-bold mb-5 text-gray-800">
                                    Team Members
                                </h2>

                                <div className="space-y-4">

                                    {selectedProject.members.map((member) => (

                                        <div
                                            key={member._id}
                                            className="flex justify-between items-center bg-indigo-50 border border-indigo-100 px-5 py-4 rounded-2xl"
                                        >

                                            <div>

                                                <p className="font-semibold text-lg">
                                                    {member.name}
                                                </p>

                                                <p className="text-gray-500 text-sm">
                                                    {member.email}
                                                </p>

                                            </div>

                                            <button
                                                onClick={() =>
                                                    removeMember(
                                                        selectedProject?._id,
                                                        member._id
                                                    )
                                                }
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                                            >
                                                Remove
                                            </button>

                                        </div>

                                    ))}

                                </div>

                            </div>
                            {/* Add Member */}

                            <div className="mb-10">

                                <h2 className="text-2xl font-bold mb-5 text-gray-800">
                                    Add Member
                                </h2>

                                <div className="flex gap-4">

                                    <select
                                        value={
                                            selectedMembers[
                                                activeProjectId
                                            ] || ""
                                        }
                                        onChange={(e) =>
                                            setSelectedMembers({
                                                ...selectedMembers,
                                                [activeProjectId]:
                                                    e.target.value
                                            })
                                        }
                                        className="flex-1 border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >

                                        <option value="">
                                            Select Member
                                        </option>

                                        {users.map((user) => (

                                            <option
                                                key={user._id}
                                                value={user.email}
                                            >
                                                {user.name}
                                            </option>

                                        ))}

                                    </select>

                                    <button
                                        onClick={addMember}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-2xl font-semibold transition"
                                    >
                                        Add
                                    </button>

                                </div>

                            </div>
                            {/* Create Task */}

                            <div className="mb-10">

                                <h2 className="text-2xl font-bold mb-5 text-gray-800">
                                    Create Task
                                </h2>

                                <form
                                    onSubmit={(e) =>
                                        createTask(
                                            e,
                                            activeProjectId
                                        )
                                    }
                                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                                >

                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Task Title"
                                        value={
                                            projectForms[
                                                activeProjectId
                                            ]?.title || ""
                                        }
                                        onChange={(e) =>
                                            handleProjectFormChange(
                                                e,
                                                activeProjectId
                                            )
                                        }
                                        className="border border-gray-300 rounded-2xl px-5 py-4"
                                    />

                                    <input
                                        type="date"
                                        name="dueDate"
                                        value={
                                            projectForms[
                                                activeProjectId
                                            ]?.dueDate || ""
                                        }
                                        onChange={(e) =>
                                            handleProjectFormChange(
                                                e,
                                                activeProjectId
                                            )
                                        }
                                        className="border border-gray-300 rounded-2xl px-5 py-4"
                                    />

                                    <textarea
                                        name="description"
                                        placeholder="Task Description"
                                        value={
                                            projectForms[
                                                activeProjectId
                                            ]?.description || ""
                                        }
                                        onChange={(e) =>
                                            handleProjectFormChange(
                                                e,
                                                activeProjectId
                                            )
                                        }
                                        className="md:col-span-2 border border-gray-300 rounded-2xl px-5 py-4"
                                    />

                                    <select
                                        name="priority"
                                        value={
                                            projectForms[
                                                activeProjectId
                                            ]?.priority || "Low"
                                        }
                                        onChange={(e) =>
                                            handleProjectFormChange(
                                                e,
                                                activeProjectId
                                            )
                                        }
                                        className="border border-gray-300 rounded-2xl px-5 py-4"
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

                                    <select
                                        name="assignedTo"
                                        value={
                                            projectForms[
                                                activeProjectId
                                            ]?.assignedTo || ""
                                        }
                                        onChange={(e) =>
                                            handleProjectFormChange(
                                                e,
                                                activeProjectId
                                            )
                                        }
                                        className="border border-gray-300 rounded-2xl px-5 py-4"
                                    >

                                        <option value="">
                                            Assign Member
                                        </option>

                                        {selectedProject.members.map(
                                            (member) => (

                                                <option
                                                    key={member._id}
                                                    value={member._id}
                                                >
                                                    {member.name}
                                                </option>

                                            )
                                        )}

                                    </select>

                                    <button
                                        type="submit"
                                        className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-semibold transition"
                                    >
                                        Create Task
                                    </button>

                                </form>

                            </div>
                        {/* Kanban Board */}

                        <div>

                            <h2 className="text-3xl font-bold mb-8 text-gray-800">
                                Project Tasks
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                {/* To Do */}

                                <div className="bg-gray-100 rounded-3xl p-5">

                                    <h3 className="text-xl font-bold mb-5 text-gray-700">
                                        To Do
                                    </h3>

                                    <div className="space-y-4">

                                        {selectedProject.tasks
                                            ?.filter(
                                                (task) =>
                                                    task.status === "To Do"
                                            )
                                            .map((task) => (

                                                <div
                                                    key={task._id}
                                                    className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition"
                                                >

                                                    <h4 className="text-lg font-bold text-gray-800">
                                                        {task.title}
                                                    </h4>

                                                    <p className="text-sm text-gray-500 mt-2">
                                                        {task.description}
                                                    </p>

                                                    <div className="mt-4 flex justify-between items-center">

                                                        <span className="text-sm font-semibold text-indigo-600">
                                                            {task.assignedTo?.name}
                                                        </span>

                                                        <div className="flex gap-2">

                                                            <select
                                                                value={task.status}
                                                                onChange={(e) =>
                                                                    updateTaskStatus(
                                                                        task._id,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="bg-gray-200 rounded-xl px-3 py-1 text-sm"
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

                                                            <button
                                                                onClick={() =>
                                                                    deleteTask(task._id)
                                                                }
                                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl text-sm"
                                                            >
                                                                Delete
                                                            </button>

                                                        </div>

                                                    </div>

                                                </div>

                                            ))}

                                    </div>

                                </div>

                                {/* In Progress */}

                                <div className="bg-yellow-50 rounded-3xl p-5">

                                    <h3 className="text-xl font-bold mb-5 text-yellow-700">
                                        In Progress
                                    </h3>

                                    <div className="space-y-4">

                                        {selectedProject.tasks
                                            ?.filter(
                                                (task) =>
                                                    task.status ===
                                                    "In Progress"
                                            )
                                            .map((task) => (

                                                <div
                                                    key={task._id}
                                                    className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition"
                                                >

                                                    <h4 className="text-lg font-bold text-gray-800">
                                                        {task.title}
                                                    </h4>

                                                    <p className="text-sm text-gray-500 mt-2">
                                                        {task.description}
                                                    </p>

                                                    <div className="mt-4 flex justify-between items-center">

                                                        <span className="text-sm font-semibold text-indigo-600">
                                                            {task.assignedTo?.name}
                                                        </span>

                                                        <div className="flex gap-2">

                                                            <select
                                                                value={task.status}
                                                                onChange={(e) =>
                                                                    updateTaskStatus(
                                                                        task._id,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="bg-gray-200 rounded-xl px-3 py-1 text-sm"
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

                                                            <button
                                                                onClick={() =>
                                                                    deleteTask(task._id)
                                                                }
                                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl text-sm"
                                                            >
                                                                Delete
                                                            </button>

                                                        </div>

                                                    </div>

                                                </div>

                                            ))}

                                    </div>

                                </div>

                                {/* Done */}

                                <div className="bg-green-50 rounded-3xl p-5">

                                    <h3 className="text-xl font-bold mb-5 text-green-700">
                                        Done
                                    </h3>

                                    <div className="space-y-4">

                                        {selectedProject.tasks
                                            ?.filter(
                                                (task) =>
                                                    task.status === "Done"
                                            )
                                            .map((task) => (

                                                <div
                                                    key={task._id}
                                                    className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition"
                                                >

                                                    <h4 className="text-lg font-bold text-gray-800">
                                                        {task.title}
                                                    </h4>

                                                    <p className="text-sm text-gray-500 mt-2">
                                                        {task.description}
                                                    </p>

                                                    <div className="mt-4 flex justify-between items-center">

                                                        <span className="text-sm font-semibold text-indigo-600">
                                                            {task.assignedTo?.name}
                                                        </span>

                                                        <div className="flex gap-2">

                                                            <select
                                                                value={task.status}
                                                                onChange={(e) =>
                                                                    updateTaskStatus(
                                                                        task._id,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="bg-gray-200 rounded-xl px-3 py-1 text-sm"
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

                                                            <button
                                                                onClick={() =>
                                                                    deleteTask(task._id)
                                                                }
                                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl text-sm"
                                                            >
                                                                Delete
                                                            </button>

                                                        </div>

                                                    </div>

                                                </div>

                                            ))}

                                    </div>

                                </div>

                            </div>

                        </div>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );
};
export default Dashboard;