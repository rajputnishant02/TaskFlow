import React, { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const Dashboard = () => {

    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    const projectId = "6ab92a04e64ad59b9007aede";

    const fetchIssues = async () => {
        try {
            setLoading(true);

            // 1. Get projects belonging to logged-in user
            const projectResponse = await api.get("/projects");

            const projects = projectResponse.data.projects;

            if (!projects.length) {
                console.log("No projects found");
                setIssues([]);
                return;
            }

            // 2. Get the first project
            const projectId = projects[0]._id;

            console.log("Dashboard Project ID:", projectId);

            // 3. Get issues for that project
            const response = await api.get(
                `/issues/project/${projectId}`
            );

            console.log("Dashboard Issues:", response.data.issues);

            setIssues(response.data.issues);

        } catch (error) {
            console.log("Dashboard Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    const totalIssues = issues.length;

    const backlogIssues = issues.filter(
        (issue) => issue.status === "backlog"
    ).length;

    const todoIssues = issues.filter(
        (issue) => issue.status === "todo"
    ).length;

    const inProgressIssues = issues.filter(
        (issue) => issue.status === "in_progress"
    ).length;

    const inReviewIssues = issues.filter(
        (issue) => issue.status === "in_review"
    ).length;

    const completedIssues = issues.filter(
        (issue) => issue.status === "done"
    ).length;


    //Priority 

    const lowPriority = issues.filter(
        (issue) => issue.priority === "low"
    ).length;

    const mediumPriority = issues.filter(
        (issue) => issue.priority === "medium"
    ).length;

    const highPriority = issues.filter(
        (issue) => issue.priority === "high"
    ).length;

    const criticalPriority = issues.filter(
        (issue) => issue.priority === "critical"
    ).length;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 p-10">
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (

        <>
            {/* Navbar */}

            < Navbar />

            <div className="min-h-screen bg-gray-100 p-10">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold">
                        TaskFlow Dashboard
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Overview of your project issues
                    </p>
                </div>


                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

                    {/* Total */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <p className="text-gray-500">
                            Total Issues
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {totalIssues}
                        </h2>
                    </div>


                    {/* To Do */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <p className="text-gray-500">
                            To Do
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {todoIssues}
                        </h2>
                    </div>


                    {/* In Progress */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <p className="text-gray-500">
                            In Progress
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {inProgressIssues}
                        </h2>
                    </div>


                    {/* Completed */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <p className="text-gray-500">
                            Completed
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {completedIssues}
                        </h2>
                    </div>

                </div>


                {/* Status Overview */}
                <div className="bg-white rounded-xl p-6 mt-8 shadow-sm">

                    <h2 className="text-xl font-semibold mb-5">
                        Issue Status
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

                        <div>
                            <p className="text-gray-500 text-sm">
                                Backlog
                            </p>

                            <p className="text-2xl font-bold">
                                {backlogIssues}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">
                                To Do
                            </p>

                            <p className="text-2xl font-bold">
                                {todoIssues}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">
                                In Progress
                            </p>

                            <p className="text-2xl font-bold">
                                {inProgressIssues}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">
                                In Review
                            </p>

                            <p className="text-2xl font-bold">
                                {inReviewIssues}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">
                                Done
                            </p>

                            <p className="text-2xl font-bold">
                                {completedIssues}
                            </p>
                        </div>

                    </div>

                </div>


                {/* Priority Overview */}
                <div className="bg-white rounded-xl p-6 mt-6 shadow-sm">

                    <h2 className="text-xl font-semibold mb-5">
                        Issue Priority
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                        <div>
                            <p className="text-gray-500 text-sm">
                                Low
                            </p>

                            <p className="text-2xl font-bold">
                                {lowPriority}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">
                                Medium
                            </p>

                            <p className="text-2xl font-bold">
                                {mediumPriority}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">
                                High
                            </p>

                            <p className="text-2xl font-bold">
                                {highPriority}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">
                                Critical
                            </p>

                            <p className="text-2xl font-bold">
                                {criticalPriority}
                            </p>
                        </div>

                    </div>

                </div>

            </div>

        </>

    );
};

export default Dashboard;