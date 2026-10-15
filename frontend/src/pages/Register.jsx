import api from "../services/api";
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            setError("");

            await api.post(
                "/auth/register",
                {
                    name,
                    email,
                    password
                }
            );

            navigate("/")

        } catch (error) {
            setError(
                error.response?.data?.message || "Registration failed"
            );
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

            <div className='w-full max-w-md bg-white rounded-xl shadow-lg p-8'>

                <h1 className='text-3xl font-bold text-center mb-2'>
                    TaskFlow
                </h1>

                <p className='text-gray-500 text-center mb-8'>
                    Create your account
                </p>

                {error && (
                    <div className='bg-red-100 text-red-600 p-3 rounded-lg mb-4' >
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister}>

                    <div className='mb-2'>

                        <label className='block mb-2 font-medium'>
                            Name
                        </label>

                        <input
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='Enter your name'
                            className='w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500'
                        />

                    </div>

                    <div className='mb-2'>

                        <label className='block mb-2 font-medium'>
                            Email
                        </label>

                        <input
                            type='text'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Enter your email'
                            className='w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500'
                        />

                    </div>

                    <div className='mb-2'>

                        <label className='block mb-2 font-medium'>
                            Password
                        </label>

                        <input
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Create a password'
                            className='w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500'
                        />

                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                    >
                        Create Account
                    </button>

                </form>

                <p className="text-center mt-6 text-gray-600">
                    Already have an account? {""}

                    <button
                        onClick={() => navigate("/")}
                        className="text-blue-600 font-medium"
                    >
                        Login
                    </button>
                </p>
            </div>

        </div>
    )
}

export default Register