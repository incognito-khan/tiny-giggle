"use client";

import React, { useState } from "react";
import {
  Calendar,
  MessageCircle,
  User,
  Baby,
  Heart,
  Camera,
  Clock,
  Smile,
  Moon,
  Utensils,
  Bath,
  BookOpen,
  Music,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  Mail,
} from "lucide-react";
import { AiOutlineDashboard } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";

const Sidebar = () => {
  const [openSections, setOpenSections] = useState({});
  const router = useRouter();
  const dispatch = useDispatch();

  const toggleSection = (key) => {
    // setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
    setOpenSections((prev) => {
      console.log("BEFORE:", prev, "CLICKED:", key, "CURRENT:", prev[key]);
      const next = { ...prev, [key]: !prev[key] };
      return next;
    });
  };

  const active = (pathname) => {
    const active = window.location.pathname === pathname;
    return active;
  };

  const handleLogout = () => {
    dispatch(logout({ router }));
  };

  const sections = [
    {
      key: "baby",
      label: "Baby",
      icon: Baby,
      items: [
        {
          name: "Children",
          href: "/parent-dashboard/children",
        },
        {
          name: "Baby Growth",
          href: "/parent-dashboard/baby-growth",
        },
        {
          name: "Milestone",
          href: "/parent-dashboard/milestones",
        },
        {
          name: "Family & Friends",
          href: "/parent-dashboard/family-friends",
        },
        {
          name: "Vaccination",
          href: "/parent-dashboard/vaccination",
        },
        {
          name: "Cloud Albums",
          href: "/parent-dashboard/cloud-albums",
        },
      ],
    },
    {
      key: "parenting",
      label: "Parenting",
      icon: Heart,
      items: ["Tips", "Schedules", "Community"],
    },
    {
      key: "shopping",
      label: "Shopping",
      icon: ShoppingCart,
      items: [
        {
          name: "Store",
          href: "/parent-dashboard/store",
        },
        {
          name: "Wishlist",
          href: "#",
        },
        {
          name: "Orders",
          href: "#",
        },
        {
          name: "Coupons",
          href: "#",
        },
      ]
    },
    {
      key: "mail",
      label: "Mail",
      icon: Mail,
      items: ["Inbox", "Sent", "Drafts"],
    },
    {
      key: "messages",
      label: "Messages",
      icon: MessageCircle,
      items: ["Chats", "Groups"],
    },
    {
      key: "mine",
      label: "Mine",
      icon: User,
      items: [
        {
          name: "My Profile",
        },
        {
          name: "Settings",
        },
        {
          name: "Logout",
        },
      ],
    },
  ];

  return (
    <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-pink-100 min-h-screen fixed lg:relative z-10">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <img src="/logo.png" alt="logo" />
        </div>

        <nav className="space-y-2">
          <Button
            variant="default"
            className="w-full justify-start bg-white rounded-full hover:bg-pink-600 transition-all"
          >
            <AiOutlineDashboard className={`w-5 h-5 mr-3 text-pink-600`} />
            <p className="text-gray-600">Dashboard</p>
          </Button>

          {/* render sections (some with dropdowns) */}
          {sections.map((section) => {
            const Icon = section.icon;
            const isOpen = !!openSections[section.key];

            return (
              <div key={section.key}>
                <button
                  onClick={() =>
                    section.items ? toggleSection(section.key) : null
                  }
                  className={`w-full flex items-center justify-between text-left rounded-full hover:bg-pink-50 transition-all
                                         ${
                                           isOpen
                                             ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                                             : "text-gray-600"
                                         }
                                        `}
                  style={{ padding: "0.375rem 0" }}
                >
                  <div className="flex items-center w-full">
                    <div className="flex items-center w-full">
                      <div className="flex items-center pl-3">
                        <Icon
                          className={`w-5 h-5 mr-3 ${
                            isOpen ? "text-white" : "text-pink-600"
                          }`}
                        />
                        <span className="">{section.label}</span>
                      </div>
                    </div>
                  </div>

                  {section.items ? (
                    <div className="pr-3">
                      {isOpen ? (
                        <ChevronUp
                          className={`w-4 h-4  
                                                ${
                                                  isOpen
                                                    ? "text-white"
                                                    : "text-gray-500"
                                                }`}
                        />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  ) : null}
                </button>

                {/* dropdown items */}
                {section.items && isOpen && (
                  <div className="mt-3 mb-2 space-y-3">
                    {section.items.map((it, idx) => {
                      const isActive = active(it.href);
                      return (
                        <Button
                          key={idx}
                          variant="ghost"
                          className={`ml-3 w-[90%] justify-start text-sm rounded-full transition-all pl-10 text-gray-600 hover:bg-pink-50 cursor-pointer ${
                            isActive
                              ? "bg-pink-100 text-black rounded-full hover:from-pink-600 hover:to-purple-600"
                              : ""
                          }`}
                          onClick={() => {
                            if (it.name === "Logout") {
                              handleLogout();
                            } else if (it.href) {
                              router.replace(it.href);
                            }
                          }}
                        >
                          {it.name}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
