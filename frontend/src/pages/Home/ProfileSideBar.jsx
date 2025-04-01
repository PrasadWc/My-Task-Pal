import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import axiosInstance from "../../utils/axiosinstance.js";

export default function ProfileSideBar({ open, setOpen, userInfo }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [result, setResult] = useState("");

  const getInitials = (name) => {
    if (!name) return "";

    const words = name.split(" ");

    let initials = "";

    for (let i = 0; i < Math.min(words.length, 2); i++) {
      initials += words[i][0];
    }

    return initials.toUpperCase();
  };

  const handleSaveChanges = async () => {
    if (newPassword === confirmNewPassword) {
      try {
        const response = await axiosInstance.post("/users/changepassword", {
          currentPassword: currentPassword,
          newPassword: newPassword,
        });
        setResult(response.data.message);
      } catch (error) {
        console.error(error);
        setResult("Failed to change password. Please try again later.");
      }
    } else {
      console.log("Passwords do not match!");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-500"
            onClick={() => setOpen(false)}
          />

          <motion.section
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="absolute inset-y-0 right-0 max-w-md w-screen bg-white shadow-xl p-6 flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">User Profile</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* Profile Picture */}
            <div className="flex flex-col items-center mt-6">
              <div className="flex items-center font-medium text-4xl justify-center w-24 h-24 rounded-full bg-gray-300">
                {getInitials(userInfo?.name)}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{userInfo.name}</h3>
              <p className="text-gray-500">{userInfo.email}</p>
              <p className="text-gray-500">
                Account Created On:{" "}
                {new Date(userInfo.createdOn).toLocaleDateString()}
              </p>
            </div>

            {/* Change Password Fields */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-300 focus:outline-none"
              />

              <label className="block text-sm font-medium text-gray-700 mt-4">
                New Password
              </label>
              <input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-300 focus:outline-none"
              />

              <label className="block text-sm font-medium text-gray-700 mt-4">
                Confirm Password
              </label>
              <input
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-300 focus:outline-none"
              />
            </div>

            {/* Save Button */}
            <div className="mt-6">
              <button
                onClick={handleSaveChanges}
                className="w-full p-2 bg-black text-white rounded-md"
              >
                Save Changes
              </button>
              <label className="flex items-center justify-center text-xs font-medium text-black mt-4">
                {result}
              </label>
            </div>
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  );
}
