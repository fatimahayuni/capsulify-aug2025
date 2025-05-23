"use client";
import { SignedIn } from "@clerk/nextjs";
import Logo from "./Logo";
import ProfileIcon from "./ProfileIcon";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function Navbar() {
  const [title, setTitle] = useState("");
  const pathname = usePathname();
  useEffect(() => {
    const pathnameParts = pathname.split("/");
    if (pathname.includes("inventory")) {
      setTitle("Fit Guide");
    }
  }, [pathname]);

  return (
    <nav className="inventory-navigation-bar mt-2">
      <div className="inventory-navigation-content">
        <Logo />

        <p className="text-xl font-semibold text-center">{title}</p>
        <div className="cursor-pointer">
          <SignedIn>
            <div className="flex gap-4 text-xs items-center justify-center">
              <ProfileIcon />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
