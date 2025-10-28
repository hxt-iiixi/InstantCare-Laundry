import React, { useState } from "react";
import { FaEdit } from "react-icons/fa"; // Edit icon
import placeholderAvatar from "/src/assets/images/user-avatar.png"; // Default avatar
import placeholderCover from "/src/assets/images/cover-placeholder.png"; // Default cover image
import AdminHeader from "../../components/church-admin/AdminHeader";
import AdminSidebar from "../../components/church-admin/AdminSidebar";


export default function MemberProfile() {
  const [avatar, setAvatar] = useState(placeholderAvatar);
  const [coverImage, setCoverImage] = useState(placeholderCover);

  // Personal details (replace these with real data from user profile or localStorage)
  const [firstName, setFirstName] = useState("Avril Joy");
  const [lastName, setLastName] = useState("Bravo");
  const [email, setEmail] = useState("avriljoy@gmail.com");
  const [contactNumber, setContactNumber] = useState("(+63) 2 123 4567");
  const [dob, setDob] = useState("04-04-2020");
  const [userRole, setUserRole] = useState("Parishioner");
  const [bio, setBio] = useState(""); // Bio placeholder

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7F3]">
      <AdminHeader />
      <AdminSidebar />

      {/* Profile card (cover, avatar, greeting, bio) */}
      <div className="max-w-4xl mx-auto mt-10 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Cover + avatar */}
        <div className="relative">
          <img
            src={coverImage}
            alt="Cover Image"
            className="w-full h-48 md:h-[300px] object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="absolute top-3 right-3 bg-white p-1 rounded-full opacity-70 cursor-pointer"
          />

          <div className="absolute left-6 -bottom-16 md:-bottom-20">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 relative">
              <img
                src={avatar}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute bottom-1 right-1 bg-white p-1 rounded-full opacity-80 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Card body: greeting + bio only */}
        <div className="pt-20 pb-8 px-6 md:py-10 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold">{`Hello, ${firstName}!`}</h2>
          <p className="text-lg text-gray-600">{userRole}</p>
          <p className="text-gray-500">Location: Dagupan City, Pangasinan</p>

          <div className="mt-6 max-w-2xl mx-auto text-left">
            <label className="text-lg font-semibold">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="4"
              className="w-full p-3 rounded-md border border-gray-300 mt-2"
              placeholder="Write something about yourself..."
            />
          </div>
        </div>
      </div>

      {/* Separate card for Church Details */}
      <div className="max-w-4xl mx-auto mt-6 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Church Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-gray-600">Church Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="p-2 mt-2 rounded-md border border-gray-300"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600">Church Location</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="p-2 mt-2 rounded-md border border-gray-300"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 mt-2 rounded-md border border-gray-300"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600">Contact Number</label>
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="p-2 mt-2 rounded-md border border-gray-300"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="p-2 mt-2 rounded-md border border-gray-300"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600">User Role</label>
            <input
              type="text"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="p-2 mt-2 rounded-md border border-gray-300"
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md">
            Discard
          </button>
          <button className="bg-orange-500 text-white py-2 px-4 rounded-md flex items-center gap-2">
            <FaEdit /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
