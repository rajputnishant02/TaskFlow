import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const columns = [
    {
        id: "backlog",
        title: "Backlog"
    },
    {
        id: "todo",
        title: "To Do"
    },
    {
        id: "in_progress",
        title: "In Progress"
    },
    {
        id: "in_review",
        title: "In Review"
    },
    {
        id: "done",
        title: "Done"
    }
];

const Issues = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [issueKey, setIssueKey] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    const [sprint, setSprint] = useState("");
    const [labels, setLabels] = useState("");
    const [creating, setCreating] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [selectedIssue, setSelectedIssue] = useState(null);

    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [commentsLoading, setCommentsLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const [users, setUsers] = useState([]);
    const [assignee, setAssignee] = useState("");

    const [assigneeFilter, setAssigneeFilter] = useState("all");

    const [projectId, setProjectId] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));



    // Temporary project ID
    // const projectId = "6ab92a04e64ad59b9007aede";

    const handleCreateIssue = async (e) => {
        e.preventDefault();

        try {
            setCreating(true);
            setError("");

            const response = await api.post("/issues", {
                issueKey,
                title,
                description,
                assignee,
                priority,
                project: projectId,
                sprint,
                labels: labels
                    .split(",")
                    .map((label) => label.trim())
                    .filter(Boolean)
            });

            setIssues((prevIssues) => [
                response.data.issue,
                ...prevIssues
            ]);

            setIssueKey("");
            setTitle("");
            setDescription("");
            setPriority("medium");
            setSprint("");
            setLabels("");
            setAssignee("");

        } catch (error) {
            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to create issue"
            );
        } finally {
            setCreating(false);
        }
    };

    const fetchIssues = async () => {
        try {
            setLoading(true);
            setError("");

            const projectResponse = await api.get("/projects");

            const projects = projectResponse.data.projects;

            if (!projects.length) {
                setError("No projects found. Please create a project first.");
                return;
            }

            const firstProjectId = projects[0]._id;

            setProjectId(firstProjectId);

            const response = await api.get(
                `/issues/project/${firstProjectId}`
            );

            console.log("ISSUES:", response.data.issues);

            setIssues(response.data.issues);

        } catch (error) {
            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to fetch issues"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (issueId, newStatus) => {
        try {
            const response = await api.put(`/issues/${issueId}`, {
                status: newStatus
            });

            setIssues((prevIssues) =>
                prevIssues.map((issue) =>
                    issue._id === issueId
                        ? response.data.issue
                        : issue
                )
            );

        } catch (error) {
            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to update issue status"
            );
        }
    };

    const handleUpdateIssue = async (issue) => {
        try {
            const response = await api.put(`/issues/${issue._id}`, {
                title: issue.title,
                description: issue.description,
                priority: issue.priority,
                sprint: issue.sprint,
                labels: issue.labels
            });

            setIssues((prevIssues) =>
                prevIssues.map((item) =>
                    item._id === issue._id
                        ? response.data.issue
                        : item
                )
            );

            setEditingId(null);

        } catch (error) {
            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to update issue"
            );
        }
    };

    const handleDeleteIssue = async (id) => {
        try {
            await api.delete(`/issues/${id}`);

            setIssues((prevIssues) =>
                prevIssues.filter(
                    (issue) => issue._id !== id
                )
            );

        } catch (error) {
            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to delete issue"
            );
        }
    };

    const fetchComments = async (issueId) => {
        try {
            setCommentsLoading(true);

            const response = await api.get(
                `/comments/issue/${issueId}`
            );

            setComments(response.data.comment);

        } catch (error) {
            console.log(error);
        } finally {
            setCommentsLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) {
            return;
        }

        try {
            const response = await api.post("/comments", {
                text: commentText,
                issueId: selectedIssue._id
            });

            setComments((prevComments) => [
                response.data.comment,
                ...prevComments
            ]);

            setCommentText("");

        } catch (error) {
            console.log(error);
        }
    };

    const filteredIssues = issues.filter((issue) => {

        const matchesSearch =
            issue.title.toLowerCase().includes(search.toLowerCase()) ||
            issue.issueKey.toLowerCase().includes(search.toLowerCase());

        const matchesPriority =
            priorityFilter === "all" ||
            issue.priority === priorityFilter;

        const matchesStatus =
            statusFilter === "all" ||
            issue.status === statusFilter;

        const matchesAssignee =
            assigneeFilter === "all" ||
            (
                assigneeFilter === "me" &&
                issue.assignee?._id === user?.id
            );

        return (
            matchesSearch &&
            matchesPriority &&
            matchesStatus &&
            matchesAssignee
        );
    });

    const fetchUsers = async () => {
        try {
            const response = await api.get("/auth/users");

            setUsers(response.data.users);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchIssues();
        fetchUsers();
    }, []);

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-600 text-lg">
                        Loading issues...
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
                        onClick={fetchIssues}
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

                <div className="max-w-7xl mx-auto">

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">
                            Issues
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Manage your project issues
                        </p>
                    </div>

                    <form
                        onSubmit={handleCreateIssue}
                        className="bg-white rounded-xl shadow p-6 mb-8"
                    >
                        <select
                            value={assignee}
                            onChange={(e) => setAssignee(e.target.value)}
                            className="border rounded-lg px-4 py-3"
                        >
                            <option value="">
                                Unassigned
                            </option>

                            {users.map((user) => (
                                <option
                                    key={user._id}
                                    value={user._id}
                                >
                                    {user.name}
                                </option>
                            ))}
                        </select>

                        <h2 className="text-xl font-semibold mb-5">
                            Create Issue
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">

                            <input
                                type="text"
                                placeholder="Issue key e.g. SF-111"
                                value={issueKey}
                                onChange={(e) => setIssueKey(e.target.value)}
                                className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <input
                                type="text"
                                placeholder="Issue title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                            className="w-full border rounded-lg px-4 py-3 mt-4 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="grid md:grid-cols-3 gap-4 mt-4">

                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="border rounded-lg px-4 py-3"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Sprint"
                                value={sprint}
                                onChange={(e) => setSprint(e.target.value)}
                                className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <input
                                type="text"
                                placeholder="Labels: bug, frontend"
                                value={labels}
                                onChange={(e) => setLabels(e.target.value)}
                                className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                        <button
                            type="submit"
                            disabled={creating}
                            className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {creating ? "Creating..." : "Create Issue"}
                        </button>
                    </form>

                    <div className="bg-white rounded-xl p-4 mb-6">

                        <div className="flex flex-col md:flex-row gap-3">

                            {/* Search */}
                            <input
                                type="text"
                                placeholder="Search issues..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="border rounded-lg px-4 py-2 flex-1"
                            />

                            {/* Priority */}
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="border rounded-lg px-4 py-2"
                            >
                                <option value="all">All Priorities</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>

                            {/* Status */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="border rounded-lg px-4 py-2"
                            >
                                <option value="all">All Status</option>
                                <option value="backlog">Backlog</option>
                                <option value="todo">To Do</option>
                                <option value="in_progress">
                                    In Progress
                                </option>
                                <option value="in_review">
                                    In Review
                                </option>
                                <option value="done">Done</option>
                            </select>

                            <select
                                value={assigneeFilter}
                                onChange={(e) => setAssigneeFilter(e.target.value)}
                                className="border rounded-lg px-4 py-2"
                            >
                                <option value="all">
                                    All Assignees
                                </option>

                                <option value="me">
                                    My Issues
                                </option>
                            </select>

                            {/* Clear */}
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setPriorityFilter("all");
                                    setStatusFilter("all");
                                    setAssigneeFilter("all");
                                }}
                                className="px-4 py-2 bg-gray-800 text-white rounded-lg"
                            >
                                Clear
                            </button>

                        </div>

                    </div>

                    {
                        filteredIssues.length === 0 && issues.length > 0 && (
                            <div className="bg-white rounded-xl p-10 text-center mb-6">
                                <h2 className="text-xl font-semibold">
                                    No matching issues
                                </h2>

                                <p className="text-gray-500 mt-2">
                                    Try changing your search or filters.
                                </p>
                            </div>
                        )
                    }

                    {/* Kanban Board */}
                    <div className="w-full overflow-x-auto">

                        <div className="grid grid-cols-5 gap-4 min-w-screen">

                            {columns.map((column) => {

                                const columnIssues = filteredIssues.filter(
                                    (issue) => issue.status === column.id
                                );

                                return (
                                    <div
                                        key={column.id}
                                        className="bg-gray-200 rounded-xl p-4"
                                    >

                                        {/* Column Header */}
                                        <div className="flex justify-between items-center mb-4">

                                            <h2 className="font-semibold text-lg">
                                                {column.title}
                                            </h2>

                                            <span className="bg-white px-2 py-1 rounded-full text-sm">
                                                {columnIssues.length}
                                            </span>

                                        </div>

                                        {/* Issues */}
                                        <div className="space-y-3">

                                            {columnIssues.map((issue) => (

                                                <div
                                                    key={issue._id}
                                                    className="bg-white rounded-lg p-4 shadow-sm"
                                                >

                                                    {editingId === issue._id ? (

                                                        /* ================= EDIT MODE ================= */

                                                        <div className="space-y-3">

                                                            <input
                                                                type="text"
                                                                value={issue.title}
                                                                onChange={(e) => {
                                                                    setIssues((prevIssues) =>
                                                                        prevIssues.map((item) =>
                                                                            item._id === issue._id
                                                                                ? {
                                                                                    ...item,
                                                                                    title: e.target.value
                                                                                }
                                                                                : item
                                                                        )
                                                                    );
                                                                }}
                                                                className="w-full border rounded px-3 py-2"
                                                            />

                                                            <textarea
                                                                value={issue.description || ""}
                                                                onChange={(e) => {
                                                                    setIssues((prevIssues) =>
                                                                        prevIssues.map((item) =>
                                                                            item._id === issue._id
                                                                                ? {
                                                                                    ...item,
                                                                                    description: e.target.value
                                                                                }
                                                                                : item
                                                                        )
                                                                    );
                                                                }}
                                                                className="w-full border rounded px-3 py-2"
                                                                placeholder="Description"
                                                            />

                                                            <select
                                                                value={issue.priority}
                                                                onChange={(e) => {
                                                                    setIssues((prevIssues) =>
                                                                        prevIssues.map((item) =>
                                                                            item._id === issue._id
                                                                                ? {
                                                                                    ...item,
                                                                                    priority: e.target.value
                                                                                }
                                                                                : item
                                                                        )
                                                                    );
                                                                }}
                                                                className="w-full border rounded px-3 py-2"
                                                            >
                                                                <option value="low">Low</option>
                                                                <option value="medium">Medium</option>
                                                                <option value="high">High</option>
                                                                <option value="critical">Critical</option>
                                                            </select>

                                                            <input
                                                                type="text"
                                                                value={issue.sprint || ""}
                                                                onChange={(e) => {
                                                                    setIssues((prevIssues) =>
                                                                        prevIssues.map((item) =>
                                                                            item._id === issue._id
                                                                                ? {
                                                                                    ...item,
                                                                                    sprint: e.target.value
                                                                                }
                                                                                : item
                                                                        )
                                                                    );
                                                                }}
                                                                className="w-full border rounded px-3 py-2"
                                                                placeholder="Sprint"
                                                            />

                                                            <div className="flex gap-2">

                                                                <button
                                                                    onClick={() => handleUpdateIssue(issue)}
                                                                    className="px-3 py-1 bg-green-500 text-white rounded"
                                                                >
                                                                    Save
                                                                </button>

                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedIssue(issue);
                                                                        fetchComments(issue._id);
                                                                    }}
                                                                    className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
                                                                >
                                                                    Comments
                                                                </button>

                                                            </div>

                                                        </div>

                                                    ) : (

                                                        /* ================= NORMAL MODE ================= */

                                                        <>

                                                            <p className="text-sm text-gray-500">
                                                                {issue.issueKey}
                                                            </p>

                                                            <h3 className="font-semibold mt-1">
                                                                {issue.title}
                                                            </h3>

                                                            {issue.description && (
                                                                <p className="text-sm text-gray-600 mt-2">
                                                                    {issue.description}
                                                                </p>
                                                            )}

                                                            <div className="mt-3">
                                                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                                    {issue.priority}
                                                                </span>
                                                            </div>

                                                            <div className="text-sm text-gray-600 mt-2">
                                                                👤 {issue.assignee?.name || "Unassigned"}
                                                            </div>

                                                            <select
                                                                value={issue.status}
                                                                onChange={(e) =>
                                                                    handleStatusChange(
                                                                        issue._id,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="w-full mt-3 border rounded px-2 py-1 text-sm"
                                                            >
                                                                <option value="backlog">Backlog</option>
                                                                <option value="todo">To Do</option>
                                                                <option value="in_progress">
                                                                    In Progress
                                                                </option>
                                                                <option value="in_review">
                                                                    In Review
                                                                </option>
                                                                <option value="done">Done</option>
                                                            </select>

                                                            <div className="flex gap-2 mt-3">

                                                                <button
                                                                    onClick={() => setEditingId(issue._id)}
                                                                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                                                                >
                                                                    Edit
                                                                </button>

                                                                <button
                                                                    onClick={() =>
                                                                        handleDeleteIssue(issue._id)
                                                                    }
                                                                    className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                                                                >
                                                                    Delete
                                                                </button>

                                                                <button
                                                                    onClick={() =>
                                                                        setSelectedIssue(issue)
                                                                    }
                                                                    className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
                                                                >
                                                                    Comments
                                                                </button>

                                                            </div>

                                                        </>

                                                    )}

                                                </div>

                                            ))}

                                            {columnIssues.length === 0 && (
                                                <p className="text-sm text-gray-500 text-center py-8">
                                                    No issues
                                                </p>
                                            )}

                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    </div>

                </div>

                {selectedIssue && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

                        <div className="bg-white rounded-xl w-full max-w-lg p-6">

                            {/* Header */}
                            <div className="flex justify-between items-center mb-4">

                                <div>
                                    <p className="text-sm text-gray-500">
                                        {selectedIssue.issueKey}
                                    </p>

                                    <h2 className="text-xl font-bold">
                                        {selectedIssue.title}
                                    </h2>
                                </div>

                                <button
                                    onClick={() => {
                                        setSelectedIssue(null);
                                        setComments([]);
                                        setCommentText("");
                                    }}
                                    className="text-gray-500 text-xl"
                                >
                                    ✕
                                </button>

                            </div>

                            {/* Comments */}
                            <div className="border-t pt-4">

                                <h3 className="font-semibold mb-3">
                                    Comments
                                </h3>

                                {commentsLoading ? (

                                    <p className="text-gray-500">
                                        Loading comments...
                                    </p>

                                ) : comments.length === 0 ? (

                                    <p className="text-gray-500">
                                        No comments yet.
                                    </p>

                                ) : (

                                    <div className="space-y-3 max-h-60 overflow-y-auto">

                                        {comments.map((comment) => (

                                            <div
                                                key={comment._id}
                                                className="bg-gray-100 rounded-lg p-3"
                                            >

                                                <p className="font-semibold text-sm">
                                                    {comment.user?.name || "User"}
                                                </p>

                                                <p className="text-sm text-gray-700 mt-1">
                                                    {comment.text}
                                                </p>

                                            </div>

                                        ))}

                                    </div>

                                )}

                            </div>

                            {/* Add comment */}
                            <div className="mt-4">

                                <textarea
                                    value={commentText}
                                    onChange={(e) =>
                                        setCommentText(e.target.value)
                                    }
                                    placeholder="Write a comment..."
                                    className="w-full border rounded-lg p-3"
                                    rows="3"
                                />

                                <button
                                    onClick={handleAddComment}
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                                >
                                    Add Comment
                                </button>

                            </div>

                        </div>

                    </div>
                )}

            </div>
        </>

    );
};

export default Issues;