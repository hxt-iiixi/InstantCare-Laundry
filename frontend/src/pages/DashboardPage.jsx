import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the JWT from localStorage
        if (!token) {
          navigate("/login"); // If no token, redirect to login
          return;
        }

        const response = await axios.get("http://localhost:4000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data); // Assuming the backend returns user data
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 mt-20 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-semibold text-center mb-6">Dashboard</h1>
      {user ? (
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Welcome, {user.username}!</h2>
          <p className="text-lg">Email: {user.email}</p>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default DashboardPage;
