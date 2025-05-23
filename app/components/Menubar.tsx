"use client";

import { StoreIcon, Menu, Home } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useState } from "react";
import { TbHanger } from "react-icons/tb";
import { FeedbackForm } from "./FeedbackForm";
import { PiDressBold } from "react-icons/pi";

type MenubarItem = {
  name?: string;
  icon: ReactNode | string;
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
      name: "Home",
      icon: "assets/icons/home.svg",
      pathname: "/home",
    },
    {
      name: "Fit Guide",
      icon: "assets/icons/fit-guide.svg",
      pathname: "/inventory",
    },
    {
      name: "Outfits",
      icon: "assets/icons/outfits.svg",
      pathname: "/outfits",
    },
    {
      name: "Menu",
      icon: "assets/icons/menu.svg",
      onClick: () => {
        setIsFeedbackOpen(true);
      },
    },
  ];

  return (
    <>
      <div className="hidden max-sm:flex max-sm:fixed w-fit rounded-full left-[50%] translate-x-[-50%] bottom-6 shadow-sm z-50 bg-primary overflow-hidden">
        <div className="flex justify-center items-center w-full mx-auto bg-[#4a34272c] px-4">
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
              <div className="flex items-center justify-center w-10 h-9">
                <img src={item.icon as string} />
              </div>
              <span className="text-[8px]">{item.name}</span>
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
