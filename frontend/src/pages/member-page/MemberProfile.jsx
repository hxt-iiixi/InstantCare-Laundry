import React, { useState } from "react";
import { FaEdit } from "react-icons/fa"; // Edit icon
import placeholderAvatar from "/src/assets/images/user-avatar.png"; // Default avatar
import placeholderCover from "/src/assets/images/cover-placeholder.png"; // Default cover image
import Navbar from "../../components/member-pages/Navbar";
import bibleImage from "/src/assets/images/bible-image.png"; // Bible image for decoration

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
      <Navbar />
      {/* Profile Header with Bible Image Side by Side */}
      <div className="relative flex items-center justify-between">

        {/* Profile Cover Image */}
        <div className="w-full">
          <img
            src={coverImage}
            alt="Cover Image"
            className="w-[897px] h-[300px] object-cover rounded-t-lg mx-auto mt-10"
          />
        </div>
        {/* Profile Avatar */}
        <div className="absolute top-1/2 left-1/4 transform -translate-x-1/4 -translate-y-1/2 p-4 rounded-full shadow-lg bg-white mt-52">
          <img
            src={avatar}
            alt="User Avatar"
            className="h-32 w-32 rounded-full object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="absolute bottom-0 right-0 bg-white p-1 rounded-full opacity-50 cursor-pointer"
          />
        </div>
        {/* Bible Image */}
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 p-4">
          <img
            src={bibleImage}
            alt="Bible Image"
            className="w-[200px] h-[300px] object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Member Name, Role, Location */}
      <div className="text-center mt-10">
        <h2 className="text-3xl font-semibold">{`Hello, ${firstName}!`}</h2>
        <p className="text-lg text-gray-600">{userRole}</p>
        <p className="text-gray-500">{`Location: Dagupan City, Pangasinan`}</p>
      </div>

      {/* Bio Section */}
      <div className="mt-10 mx-auto max-w-4xl px-6">
        <div className="flex flex-col gap-4">
          <label className="text-lg font-semibold">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="4"
            className="p-3 rounded-md border border-gray-300"
            placeholder="Write something about yourself..."
          />
        </div>
      </div>

      {/* Personal Details Section */}
      <div className="mt-10 mx-auto max-w-4xl px-6">
        <h3 className="text-xl font-semibold mb-4">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-gray-600">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="p-2 mt-2 rounded-md border border-gray-300"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600">Last Name</label>
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
