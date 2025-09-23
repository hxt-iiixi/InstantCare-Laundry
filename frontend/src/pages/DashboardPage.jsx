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
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // redirect if not logged in
      return;
    }

    try {
      const response = await axios.get("http://localhost:4000/api/profile", {
        headers: { Authorization: `Bearer ${token}` }, // JWT token in header
      });

      console.log("User response:", response.data); // <-- ADD THIS LINE
      setUser(response.data.user); // set user state
      setLoading(false);
    } catch (err) {
      console.error(err); // <-- ADD THIS LINE
      setError("Failed to fetch user data");
      setLoading(false);
    }
  };

  fetchUserData();
}, [navigate]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 mt-20 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-semibold text-center mb-6">Dashboard</h1>
      {user && (
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Welcome, {user.username}!</h2>
          <p className="text-lg">Email: {user.email}</p>
          <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
