"use client";

import { StoreIcon, MessageSquare, Menu, Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useState } from "react";
import { TbHanger } from "react-icons/tb";
import { FeedbackForm } from "./FeedbackForm";

type MenubarItem = {
  name: string;
  icon: ReactNode;
  pathname?: string;
  onClick?: () => void;
};

const Menubar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const handleSubmit = async (data: any) => {
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to submit feedback");
    }
  };

  const menubarItems: MenubarItem[] = [
    {
      name: "Inventory",
      icon: <StoreIcon className="h-4 w-4" />,
      pathname: "/inventory",
    },
    {
      name: "Outfits",
      icon: <TbHanger className="h-4 w-4" />,
      pathname: "/outfits",
    },
    {
      name: "Feedback",
      icon: <MessageSquare className="h-4 w-4" />,
      onClick: () => setIsFeedbackOpen(true),
    },
    {
      name: "Favourites",
      icon: <Heart className="h-4 w-4" />,
      pathname: "/favourites",
    },
    {
      name: "Menu",
      icon: <Menu className="h-4 w-4" />,
      pathname: "/menu",
    },
  ];

  return (
    <>
      <div className="hidden max-sm:flex max-sm:fixed w-[90%] rounded-full left-[50%] translate-x-[-50%] bottom-6 shadow-sm z-50 bg-secondary overflow-hidden">
        <div className="flex justify-between items-center w-full">
          {menubarItems.map((item) => (
            <div
              key={item.name}
              className={`flex flex-col items-center justify-center cursor-pointer px-3 py-1 ${
                pathname === item.pathname ? "bg-primary" : ""
              }`}
              onClick={() => {
                if (item.pathname) {
                  router.push(item.pathname);
                } else if (item.onClick) {
                  item.onClick();
                }
              }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-ful">
                {item.icon}
              </div>
              <span className="text-[10px]">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <FeedbackForm
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Menubar;
