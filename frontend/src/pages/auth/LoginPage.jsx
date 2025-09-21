import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to the backend for login
      const response = await axios.post("http://localhost:4000/api/login", { email, password });

      // Store the JWT token in localStorage upon successful login
      localStorage.setItem("token", response.data.token);

      // Optionally, you can use the user's name from the response if available
      alert("Login successful");

      // Redirect the user to the Dashboard page after successful login
      navigate("/dashboard");
    } catch (err) {
      // Handle errors (e.g., invalid credentials or server issues)
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }} 
      className="max-w-md mx-auto p-8 mt-20 bg-white rounded-lg shadow-xl"
    >
      <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition duration-300"
        >
          Login
        </button>
      </form>
      <p className="text-center mt-4">
        Don't have an account? <a href="/register" className="text-purple-500 hover:underline">Register here</a>
      </p>
    </motion.div>
  );
};

export default LoginPage;
