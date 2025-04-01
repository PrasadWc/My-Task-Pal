import React, { useState, useEffect } from "react";
import PasswordInput from "../../inputs/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";

const PasswordReset = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Get email from localStorage that was stored during OTP request
    const storedEmail = localStorage.getItem("resetEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();

    // Reset previous errors
    setOtpError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Validate inputs
    let isValid = true;

    if (!otp) {
      setOtpError("Please enter the OTP.");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Please enter a password.");
      isValid = false;
    }

    if (!confirmpassword) {
      setConfirmPasswordError("Please confirm your password.");
      isValid = false;
    } else if (password !== confirmpassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/resetpassword", {
        email: email,
        otp: otp,
        newPassword: password,
      });

      if (response.status === 200) {
        setMessage(response.data.message || "Password changed successfully!");
        setResetSuccess(true);
        // Clear form
        setOtp("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Failed to reset password. Please try again.");
      }
      setResetSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Password Reset
        </h2>

        <form className="space-y-4" onSubmit={handleReset}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter One-Time Password"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {otpError && (
              <p className="text-red-500 text-xs mt-1">{otpError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <PasswordInput
              placeholder="Enter Password Again"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPasswordError && (
              <p className="text-red-500 text-xs mt-1">
                {confirmPasswordError}
              </p>
            )}
          </div>

          {message && (
            <p
              className={`text-sm ${
                resetSuccess ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || resetSuccess}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:bg-blue-300"
          >
            {loading ? "Processing..." : "Change Password"}
          </button>
        </form>

        {resetSuccess && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Please{" "}
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Log In Here
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;
