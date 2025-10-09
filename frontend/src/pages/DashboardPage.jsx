import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideNav from "../components/Super-admin/SideNav"; // Import SideNav component
import TopNav from "../components/Super-admin/TopNav"; // Import TopNav component
import RightImg from "../assets/images/jc.jpg";
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
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("User response:", response.data);
        setUser(response.data.user); // set user state
        setLoading(false);
      } catch (err) {
        console.error(err);
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
    <div className="flex min-h-screen bg-gray-50 pt-16">
      <SideNav /> {/* Use the SideNav component */}
      <div className="flex-1 bg-white p-8 ml-64">
        <TopNav /> {/* Use the TopNav component */}
        <div className="container mx-auto p-6">

          {/* Group 1: Welcome Text + Button with Image on the Right */}
          <div className="flex items-center bg-[#fff5f0] p-8 rounded-md mb-12">
            {/* Left side - Text and Button */}
            <div className="flex flex-col w-1/2">
              <h1 className="text-3xl font-semibold text-black text-left mb-6">
                Welcome, Ampower Team!
              </h1>
              <p className="text-lg text-black text-left mb-8">
                Gain comprehensive control and insights over all church operations and system settings. Your central hub for management.
              </p>
              <div className="text-left">
                <button className="bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600">
                  View All Churches
                </button>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="w-1/2 content-center">
              <img
                src={RightImg}  
                alt="Ampower"
                className="w-120 h-80 object-fill rounded-md justify-self-center "
              />
            </div>
          </div>

          {/* Group 2: Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className=" p-6 rounded-lg shadow-md text-center">
              <h2 className="text-2xl text-left font-semibold">Total Registered Churches</h2>
              <p className="text-[34px] text-left font-bold text-gray-700 mt-4">5</p>
              <p className="text-sm text-left text-gray-700 font-semibold mt-4">Overall churches in the system</p>
            </div>
            <div className=" p-6 rounded-lg shadow-md text-center">
              <h2 className="text-2xl text-left font-semibold">Pending Registrations</h2>
              <p className="text-[34px]  text-left font-bold text-gray-700 mt-4">2</p>
               <p className="text-sm text-left text-gray-700 font-semibold mt-4">Awaiting your approval</p>
            </div>
            <div className=" p-6 rounded-lg shadow-md text-center">
              <h2 className="text-2xl text-left font-semibold">Total Approved Churches</h2>
              <p className="text-[34px]  text-left font-bold text-gray-700 mt-4">2</p>
               <p className="text-sm text-left text-gray-700 font-semibold mt-4">Overall approved in the system</p>
            </div>
            <div className=" p-6 rounded-lg shadow-md text-center">
              <h2 className="text-2xl text-left font-semibold">Total Rejected Churches</h2>
              <p className="text-[34px] text-left font-bold text-gray-700 mt-4">1</p>
               <p className="text-sm text-left text-gray-700 font-semibold mt-4">Awaiting your approval</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
