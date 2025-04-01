import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };
  return (
    <div>
      

      <div className="relative">
        <input
          onChange={onChange}
          value={value}
          type={isShowPassword ? "text" : "password"}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder={placeholder || "Enter Password"}
        />

        <div
          className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-blue-500"
          onClick={toggleShowPassword}
        >
          {isShowPassword ? (
            <FaRegEyeSlash size={22} />
          ) : (
            <FaRegEye size={22} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordInput;
