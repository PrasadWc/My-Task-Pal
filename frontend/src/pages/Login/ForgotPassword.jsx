import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailerror, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  const validateEmail = (email) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    } else {
      setEmailError("");
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/sendresetotp", {
        email: email,
      });

      if (response.status === 200) {
        setMessage(response.data.message || "OTP sent successfully!");
        setOtpSent(true); // Enable the next button
        // Store email in localStorage or state to use in OTP verification
        localStorage.setItem("resetEmail", email);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Failed to send OTP. Please try again.");
      }
      setOtpSent(false); // Ensure next button remains disabled
    } finally {
      setLoading(false);
    }
  };

  const navigateToResetPage = () => {
    navigate("/resetpassword");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Forgot Password
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter Registered Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {emailerror && (
            <p className="text-red-500 text-xs pb-1">{emailerror}</p>
          )}
          {message && (
            <p
              className={`text-sm pb-1 ${
                otpSent ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:bg-blue-300"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>

          <button
            type="button"
            onClick={navigateToResetPage}
            disabled={!otpSent}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
