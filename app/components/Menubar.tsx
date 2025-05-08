"use client";

import { StoreIcon, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode } from "react";
import { TbHanger } from "react-icons/tb";
type MenubarItem = {
  name: string;
  icon: ReactNode;
  pathname: string;
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
    name: "Profile",
    icon: <User className="h-4 w-4" />,
    pathname: "/profile",
  },
];

const Menubar = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="hidden max-sm:flex max-sm:fixed w-full px-2 py-2 bottom-0 z-50 bg-primary">
      <div className="flex justify-around items-center gap-2 w-full">
        {menubarItems.map((item) => (
          <div
            key={item.name}
            className={`flex flex-col items-center justify-center cursor-pointer ${
              pathname === item.pathname ? "bg-accent text-primary" : ""
            }`}
            onClick={() => router.push(item.pathname)}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-ful">
              {item.icon}
            </div>
            <span className="text-[10px]">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menubar;
