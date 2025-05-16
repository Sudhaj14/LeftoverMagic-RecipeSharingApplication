import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center pt-8">
      {isLogin ? (
        <Login switchToRegister={() => setIsLogin(false)} />
      ) : (
        <Register switchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
};

const Login = ({ switchToRegister }) => {
  const [_, setCookies] = useCookies(["access_token"]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      alert("Please fill in both username and password.");
      return;
    }
    try {
      const result = await axios.post("https://leftovermagic-recipesharing-application.onrender.com/auth/login", {
        username,
        password,
      });
      setCookies("access_token", result.data.token);
      window.localStorage.setItem("userID", result.data.userID);render
      navigate("/");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Login failed. Please check your credentials.");
      }
      console.error(error);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 border-4 border-gradient-to-r from-[#F07B4D] to-[#A9D8E9]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="text-center mb-4"> {/* Decreased margin bottom */}
          <h2 className="text-3xl font-semibold text-[#F07B4D]">Login</h2>
          <p className="text-[#034f6d] font-semibold text-lg mt-2"> {/* Increased gap here */}
            Welcome back! Please login to your account.
          </p>
        </div>

        <div className="space-y-4 mb-6"> {/* Reduced gap between input and text */}
          <input
            className="w-full p-4 bg-gray-100 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#F07B4D] transition duration-300 ease-in-out"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            className="w-full p-4 bg-gray-100 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#F07B4D] transition duration-300 ease-in-out"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#F07B4D] text-white text-lg font-semibold py-3 rounded-lg hover:bg-[#B26E3D] transition duration-300"
        >
          Login
        </button>

        <div className="text-center font-semibold mt-2 text-lg text-gray-600"> {/* Decreased margin top */}
          Don&apos;t have an account?{" "}
          <a
            className="text-[#F07B4D] font-semibold hover:text-[#B26E3D] cursor-pointer"
            onClick={switchToRegister}
          >
            Register
          </a>
        </div>
      </form>
    </div>
  );
};

const Register = ({ switchToLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      alert("Please fill in both username and password.");
      return;
    }
    try {
      await axios.post("https://leftovermagic-recipesharing-application.onrender.com/auth/register", {
        username,
        password,
      });
      alert("Registration Completed! Now login.");
      switchToLogin();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Registration failed. Please try again.");
      }
      console.error(error);
    }
  };

  return (
<div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 mx-4 sm:mx-6 md:mx-8 border-4 border-gradient-to-r from-[#F07B4D] to-[#A9D8E9]">
<form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold text-[#F07B4D]">Register</h2>
          <p className="text-[#034f6d] text-lg">Please create an account to continue.</p>
        </div>

        <div className="space-y-4">
          <input
            className="w-full p-4 bg-gray-100 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#F07B4D] transition duration-300 ease-in-out"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            className="w-full p-4 bg-gray-100 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#F07B4D] transition duration-300 ease-in-out"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#F07B4D] text-lg text-white font-semibold py-3 rounded-lg hover:bg-[#B26E3D] transition duration-300"
        >
          Register
        </button>

        <div className="text-center mt-4 text-lg text-gray-600">
          Already have an account?{" "}
          <a
            className="text-[#F07B4D] font-semibold hover:text-[#B26E3D] cursor-pointer"
            onClick={switchToLogin}
          >
            Login
          </a>
        </div>
      </form>
    </div>
  );
};
