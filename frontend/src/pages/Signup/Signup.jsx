import React, { useState } from "react";
import PasswordInput from "../../inputs/PasswordInput";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance.js";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [nameerror, setNameError] = useState("");
  const [emailerror, setEmailError] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return regex.test(email);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name) {
      setNameError("Please enter your name.");
      return;
    } else {
      setNameError("");
    }

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

    //Sign up API
    try {
      const response = await axiosInstance.post("/users/add", {
        name: name,
        email: email,
        password: password,
      });

      if (response.status === 200 || response.status === 201) {
        // Show success alert
        alert(response.data.message || "Sign up successful!");
        // Clear form fields if needed
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setError("Failed to create account.");
      }
    } catch (error) {
      if (
        error.response ||
        error.response.data ||
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred during sign up. Please try again.");
      }
    }
  };

  return (
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
          Sign Up
        </h2>

        <form class="space-y-4" onSubmit={handleSignup}>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {nameerror && (
            <p className="text-red-500 text-xs pb-1">{nameerror}</p>
          )}

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

          <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors">
            Create a Acoount
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-gray-600">
          Already have an Account?
          <Link to="/" class="text-blue-600 hover:text-blue-500 font-medium">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
