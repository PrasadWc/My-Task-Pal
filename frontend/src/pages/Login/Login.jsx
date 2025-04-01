import React, { useState } from "react";
import PasswordInput from "../../inputs/PasswordInput";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailerror, setEmailError] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return regex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    } else {
      setEmailError("");
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    } else {
      setError("");
    }

    //Login APi
    try {
      const response = await axiosInstance.post("/users/login", {
        email: email,
        password: password,
      });

      if (response.status === 200 && response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else {
        setError("Invalid email or password.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while trying to log in. please try again");
      }
    }
  };

  return (
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
          Log In
        </h2>

        <form class="space-y-4" onSubmit={handleLogin}>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {emailerror && (
            <p className="text-red-500 text-xs pb-1">{emailerror}</p>
          )}

          <label class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>

          <div>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link
              to="forgotpassword"
              class="text-sm text-blue-600 hover:text-blue-500"
            >
              Forgot password?
            </Link>
          </div>

          <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors">
            Log In
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-gray-600">
          Don't have an account?
          <Link
            to="/signup"
            class="text-blue-600 hover:text-blue-500 font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
