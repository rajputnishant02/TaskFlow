import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    return (
        <nav className="bg-gray-900 text-white px-6 py-4">

            <div className="max-w-7xl mx-auto flex justify-between items-center">

                {/* Logo */}
                <Link
                    to="/dashboard"
                    className="text-2xl font-bold"
                >
                    TaskFlow
                </Link>

                {/* Navigation */}
                <div className="flex items-center gap-6">

                    <Link
                        to="/dashboard"
                        className="hover:text-gray-300"
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/projects"
                        className="hover:text-gray-300"
                    >
                        Projects
                    </Link>

                    <Link
                        to="/issues"
                        className="hover:text-gray-300"
                    >
                        Issues
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </nav>
    );
};

export default Navbar;