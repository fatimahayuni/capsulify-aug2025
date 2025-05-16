"use client";
import { SignedIn } from "@clerk/nextjs";
import LogoutButton from "./LogoutButton";
import Logo from "./Logo";
import ProfileIcon from "./ProfileIcon";

function Navbar() {
  return (
    <nav className="inventory-navigation-bar">
      <div className="inventory-navigation-content">
        <Logo />
        <div className="cursor-pointer">
          <SignedIn>
            <div className="flex gap-4 text-xs items-center justify-center">
              <LogoutButton />
              <ProfileIcon />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
