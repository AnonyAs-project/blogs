import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";

const GoogleLoginButton = () => {

  const handleGoogleLogin = () => {
    window.open("http://localhost:3000/api/auth/google", "_self");
  };


 

  return (
    <div className="flex justify-center">
      <button
        onClick={handleGoogleLogin}
        className="my-4 flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded-md shadow-md text-sm transition-all duration-300 hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        aria-label="Login with Google"
        type="button"
      >
        <FcGoogle size={18} />
        <span className="font-medium">Login with Google</span>
      </button>
    </div>
  );
};

export default GoogleLoginButton;
