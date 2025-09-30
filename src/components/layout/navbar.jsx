"use client";

import { useState } from "react";
import {
  Phone,
  Clock,
  Search,
  Menu,
  Facebook,
  Linkedin,
  Youtube,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";

export default function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const isUserLoggedIn = useSelector((state) => state.auth.isUserLoggedIn);
  const childId = useSelector((state) => state.child.childId);
  console.log(childId, 'childId')
  const [hovered, setHovered] = useState("HOME");
  const navItems = isUserLoggedIn
    ? ["HOME", "ABOUT", "DOWNLOAD", "BLOG", "CONTACT", "DASHBOARD", "LOGOUT"]
    : ["HOME", "ABOUT", "DOWNLOAD", "BLOG", "CONTACT", "LOGIN", "SIGNUP"];
  const router = useRouter();
  const dispatch = useDispatch();

  const navigator = (item) => {
    if (item === "HOME") router.push("/");
    if (item === "ABOUT") router.push("/about");
    if (item === "BLOG") router.push("/blogs");
    if (item === "HOME") router.push("/");
    if (item === "CONTACT") router.push("/contact");
    if (item === "LOGIN") router.push("/auth?tab=login");
    if (item === "SIGNUP") router.push("/auth?tab=signup");
    if (item === "DASHBOARD") router.push(user?.role === 'admin' ? "/admin-dashboard" : "/parent-dashboard/children");
    if (item === "LOGOUT") handleLogout();
  };

  const handleLogout = () => {
    dispatch(logout({ router }));
  };

  return (
    <div className="w-full">
      {/* Top Bar */}
      <div className="bg-secondary text-white px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span className="font-medium">Phone : +1 333 456 888</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-yellow-400 font-medium">Opening Time :</span>
            <span>9:30am-5:30pm</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-medium">Follow Us :</span>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 cursor-pointer">
                <Facebook className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 cursor-pointer">
                <Linkedin className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 cursor-pointer">
                <Youtube className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex shrink-0 items-center gap-2">
              <img
                src="/logo.png"
                alt=""
                className="h-20 bg-cover bg-center object-center"
              />
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex flex-row items-center gap-0">
              {navItems.map((item) => (
                <div
                  key={item}
                  className="relative flex items-center nav-item cursor-pointer"
                  onClick={() => navigator(item)}
                  onMouseEnter={() => setHovered(item)}
                  onMouseLeave={() => setHovered(item)}
                >
                  <button
                    className={`px-6 z-10 py-2 cursor-pointer font-semibold text-sm transition-colors duration-200 ${
                      hovered === item
                        ? "text-white"
                        : "text-gray-700 hover:text-purple-600"
                    }`}
                  >
                    {item}
                  </button>

                  {/* Highlight Box */}
                  {hovered === item && (
                    <svg
                      className="nav-highlight-svg absolute top-1 left-5 transform animate-left-grow cursor-pointer"
                      width="87"
                      height="31"
                      viewBox="0 0 87 31"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        className="highlight-path"
                        d="M0 4.14031C0 1.87713 1.87602 0.0646902 4.13785 0.142684L83.1379 2.86682C85.2921 2.94111 87 4.70896 87 6.86445V25.0909C87 27.2642 85.2647 29.0399 83.0919 29.0898L4.09193 30.9059C1.84739 30.9575 0 29.1521 0 26.907V4.14031Z"
                        fill="#70167E"
                      />
                    </svg>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Search className="w-5 h-5 text-white" />
              </button>
              <button className="md:hidden">
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
