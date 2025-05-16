"use client";

import { StoreIcon, User, MessageSquare } from "lucide-react";
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
      name: "Profile",
      icon: <User className="h-4 w-4" />,
      pathname: "/profile",
    },
  ];

  return (
    <>
      <div className="hidden max-sm:flex max-sm:fixed w-full bottom-0 z-50 bg-primary">
        <div className="flex justify-between items-center gap-2 w-full">
          {menubarItems.map((item) => (
            <div
              key={item.name}
              className={`flex flex-col items-center justify-center cursor-pointer px-4 py-2 ${
                pathname === item.pathname
                  ? "text-primary border-t-2 border-amber-950"
                  : ""
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
