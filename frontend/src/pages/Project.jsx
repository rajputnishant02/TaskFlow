import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const Project = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [name, setName] = useState("");
    const [key, setKey] = useState("");
    const [sprint, setSprint] = useState("");
    const [creating, setCreating] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const handleCreateProject = async (e) => {
        e.preventDefault();

        try {
            setCreating(true);
            setError("");

            const response = await api.post("/projects", {
                name,
                key,
                sprint
            });

            setProjects((prevProjects) => [
                response.data.project,
                ...prevProjects
            ]);

            setName("");
            setKey("");
            setSprint("");

        } catch (error) {
            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to create project"
            );
        } finally {
            setCreating(false);
        }
    };

    const handleUpdateProject = async (id) => {
        try {
            const project = projects.find(
                (project) => project._id === id
            );

            const response = await api.put(`/projects/${id}`, {
                name: project.name,
                key: project.key,
                sprint: project.sprint
            });

            setProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project._id === id
                        ? response.data.project
                        : project
                )
            );

            setEditingId(null);

        } catch (error) {
            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to update project"
            );
        }
    };

    const handleDeleteProject = async (id) => {
        try {
            await api.delete(`/projects/${id}`);

            setProjects((prevProjects) =>
                prevProjects.filter(
                    (project) => project._id !== id
                )
            );

        } catch (error) {
            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to delete project"
            );
        }
    };

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/projects");

            setProjects(response.data.projects);

        } catch (error) {
            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to fetch projects"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-600 text-lg">
                        Loading projects...
                    </p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />

                <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">

                    <p className="text-red-600 text-lg mb-4">
                        {error}
                    </p>

                    <button
                        onClick={fetchProjects}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Retry
                    </button>

                </div>
            </>
        );
    }
    return (

        <>
            <Navbar />

            <div className="min-h-screen bg-gray-100 p-8">

                <div className="max-w-6xl mx-auto">

                    <div className="flex justify-between items-center mb-8">

                        <div>
                            <h1 className="text-3xl font-bold">
                                Projects
                            </h1>

                            <p className="text-gray-500 mt-1">
                                Manage your TaskFlow projects
                            </p>

                            <form
                                onSubmit={handleCreateProject}
                                className="bg-white rounded-xl shadow p-6 mb-8"
                            >
                                <h2 className="text-xl font-semibold mb-5">
                                    Create Project
                                </h2>

                                <div className="grid md:grid-cols-3 gap-4">

                                    <input
                                        type="text"
                                        placeholder="Project name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Project key e.g. SF"
                                        value={key}
                                        onChange={(e) => setKey(e.target.value)}
                                        className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Sprint"
                                        value={sprint}
                                        onChange={(e) => setSprint(e.target.value)}
                                        className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                </div>

                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {creating ? "Creating..." : "Create Project"}
                                </button>
                            </form>

                        </div>

                    </div>

                    {projects.length === 0 ? (
                        <div className="bg-white rounded-xl shadow p-10 text-center">
                            <h2 className="text-xl font-semibold">
                                No projects yet
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Create your first project to get started.
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {projects.map((project) => (
                                <div
                                    key={project._id}
                                    className="bg-white rounded-xl shadow p-6"
                                >
                                    {editingId === project._id ? (
                                        <>
                                            <input
                                                value={project.name}
                                                onChange={(e) => {
                                                    setProjects((prevProjects) =>
                                                        prevProjects.map((item) =>
                                                            item._id === project._id
                                                                ? {
                                                                    ...item,
                                                                    name: e.target.value
                                                                }
                                                                : item
                                                        )
                                                    );
                                                }}
                                                className="border rounded-lg px-3 py-2 w-full mb-3"
                                            />

                                            <input
                                                value={project.key}
                                                onChange={(e) => {
                                                    setProjects((prevProjects) =>
                                                        prevProjects.map((item) =>
                                                            item._id === project._id
                                                                ? {
                                                                    ...item,
                                                                    key: e.target.value
                                                                }
                                                                : item
                                                        )
                                                    );
                                                }}
                                                className="border rounded-lg px-3 py-2 w-full mb-3"
                                            />

                                            <input
                                                value={project.sprint || ""}
                                                onChange={(e) => {
                                                    setProjects((prevProjects) =>
                                                        prevProjects.map((item) =>
                                                            item._id === project._id
                                                                ? {
                                                                    ...item,
                                                                    sprint: e.target.value
                                                                }
                                                                : item
                                                        )
                                                    );
                                                }}
                                                className="border rounded-lg px-3 py-2 w-full mb-4"
                                            />

                                            <button
                                                onClick={() => handleUpdateProject(project._id)}
                                                className="bg-green-600 text-white px-4 py-2 rounded-lg mr-2"
                                            >
                                                Save
                                            </button>

                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="bg-gray-300 px-4 py-2 rounded-lg"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <h2 className="text-xl font-semibold">
                                                {project.name}
                                            </h2>

                                            <p className="text-sm text-gray-500 mt-1">
                                                {project.key}
                                            </p>

                                            {project.sprint && (
                                                <p className="mt-3 text-sm text-gray-600">
                                                    Sprint: {project.sprint}
                                                </p>
                                            )}

                                            <div className="mt-5">

                                                <button
                                                    onClick={() => setEditingId(project._id)}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteProject(project._id)}
                                                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                                                >
                                                    Delete
                                                </button>

                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}

                        </div>
                    )}

                </div>

            </div>
        </>

    );
}

export default Project