import { useAuth, useUser } from "@clerk/nextjs";
import { LogOut, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ProfileIcon = () => {
  const { user } = useUser();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const { signOut } = useAuth();

  const handleLogout = async () => {
    sessionStorage.clear();
    await signOut();
  };

  return (
    <div
      className="rounded-full relative"
      onClick={() => {
        setShowDropdown((prev) => !prev);
      }}
    >
      {user?.imageUrl ? (
        <Image
          src={user?.imageUrl}
          alt="Profile Image"
          width={32}
          height={32}
          className="rounded-full"
        />
      ) : (
        <p className="w-full h-full font-bold cursor-pointer">
          {`${user?.firstName?.charAt(0).toUpperCase()}${user?.lastName
            ?.charAt(0)
            .toUpperCase()}`}
        </p>
      )}

      {showDropdown && (
        <div className="absolute top-10 right-0 bg-secondary shadow-xl rounded-lg z-50 p-2 w-[135px]">
          <button
            className="text-sm text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-2"
            onClick={() => {
              router.push("/profile");
              setShowDropdown(false);
            }}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" /> <p className="text-sm">Profile</p>
            </div>
          </button>
          <button
            className="text-sm text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-2"
            onClick={() => {
              sessionStorage.clear();
              handleLogout();
              setShowDropdown(false);
            }}
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4" /> <p className="text-sm">Log out</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
