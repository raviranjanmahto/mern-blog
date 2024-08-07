import { useState } from "react";
import { NavLink } from "react-router-dom";

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

        <div>
          <button className="flex items-center px-3 py-4 bg-[#FAFAFA] rounded text-sm text-gray-500 hover:text-gray-900">
            Menu
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
