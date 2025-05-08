import { useAuth } from "@clerk/nextjs";
import React from "react";

const LogoutButton = () => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    sessionStorage.clear();
    await signOut();
  };
  return (
    <button
      className="bg-accent text-white px-3 py-2 rounded-md"
      onClick={handleLogout}
    >
      Log out
    </button>
  );
};

export default LogoutButton;
