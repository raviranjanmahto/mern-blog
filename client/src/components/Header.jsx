import { useState } from "react";
import { NavLink } from "react-router-dom";
import { IoCloseOutline, IoMenuOutline } from "react-icons/io5";

const navList = [
  { path: "/", name: "Home" },
  { path: "/about-us", name: "About Us" },
  { path: "/privacy-policy", name: "Privacy Policy" },
  { path: "/contact-us", name: "Contact Us" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white py-6 border">
      <nav className="container mx-auto flex justify-between px-5">
        <NavLink to="/">
          <img src="/logo.png" alt="logo" className="h-12" />
        </NavLink>
        <ul className="sm:flex hidden items-center gap-8">
          {navList.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {item.name}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
        </ul>

        {/* Toggle menu */}
        <div className="flex items-center sm:hidden">
          <button
            onClick={toggleMenu}
            className="flex items-center px-3 py-2 bg-[#FAFAFA] rounded text-sm text-gray-500 hover:text-gray-900"
          >
            {isMenuOpen ? (
              <IoCloseOutline size={24} />
            ) : (
              <IoMenuOutline size={24} />
            )}
          </button>
        </div>
      </nav>
      {/* Mobile menu item */}
      {isMenuOpen && (
        <ul className="fixed top-[108px] left-0 w-full h-auto pb-8 border-b bg-white shadow-sm z-50">
          {navList.map((item, index) => (
            <li onClick={toggleMenu} key={index} className="mt-5 px-4">
              <NavLink
                to={item.path}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {item.name}
              </NavLink>
            </li>
          ))}
          <li onClick={toggleMenu} className="px-4 mt-5">
            <NavLink to="/login">Login</NavLink>
          </li>
        </ul>
      )}
    </header>
  );
};

export default Header;
