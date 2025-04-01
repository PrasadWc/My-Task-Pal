import React from "react";

const Navbar = ({ onProfileClick, userInfo, onLogout }) => {
  const getInitials = (name) => {
    if (!name) return "";

    const words = name.split(" ");

    let initials = "";

    for (let i = 0; i < Math.min(words.length, 2); i++) {
      initials += words[i][0];
    }

    return initials.toUpperCase();
  };

  //
  //

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">My Tasks</h2>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-200">
          {" "}
          {getInitials(userInfo?.name)}
        </div>

        <div>
          <p
            onClick={onProfileClick}
            className="text-sm font-medium cursor-pointer"
          >
            {" "}
            {userInfo.name}
          </p>
          <button
            onClick={onLogout}
            className="text-sm text-slate-600 underline cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
