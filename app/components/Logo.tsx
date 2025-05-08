"use client";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();
  return (
    <div
      className="inventory-logo-container cursor-pointer"
      onClick={() => router.push("/")}
    >
      <img
        src="/assets/images/logo/logo.svg"
        alt="Capsulify Logo"
        className="app-logo"
      />
    </div>
  );
};

export default Logo;
