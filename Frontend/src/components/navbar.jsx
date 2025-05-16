import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import logo from "../assets/logo.png";

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.clear();
    navigate("/auth");
  };

const menuItems = (
  <>
    <Link to="/" className="hover:text-[#dd6b20] transition" onClick={() => setIsMenuOpen(false)}>Home</Link>
    <Link to="/create-recipe" className="hover:text-[#dd6b20] transition" onClick={() => setIsMenuOpen(false)}>Create</Link>
    <Link to="/saved-recipes" className="hover:text-[#dd6b20] transition" onClick={() => setIsMenuOpen(false)}>Saved</Link>
    {!cookies.access_token ? (
      <Link to="/auth" className="hover:text-[#dd6b20] transition" onClick={() => setIsMenuOpen(false)}>Login/Register</Link>
    ) : (
      <button onClick={() => { logout(); setIsMenuOpen(false); }} className="hover:text-[#dd6b20] transition">Logout</button>
    )}
  </>
);


  return (
    <nav
      className="mx-auto mt-6 w-[90%] md:w-[60%] px-4 py-3 rounded-full shadow-lg flex justify-between items-center transition-all duration-500 animate-fade-in-up"
      style={{
        background:
          "linear-gradient(132deg, rgb(251, 165, 116) 0%, rgb(216, 245, 251) 100%)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="RecipeHub Logo" className="h-8 w-10 rounded-full" />
        <span className="text-2xl font-bold text-[#3b3b3b] tracking-wide">LeftoverMagic</span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6 text-[#3b3b3b] font-semibold text-xl items-center">
        {menuItems}
      </div>

      {/* Hamburger Icon */}
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
          <svg className="w-7 h-7 text-[#3b3b3b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-20 left-4 right-4 bg-white rounded-lg shadow-md p-4 z-50 flex flex-col gap-4 text-[#3b3b3b] font-semibold text-lg md:hidden">
          {menuItems}
        </div>
      )}
    </nav>
  );
};
