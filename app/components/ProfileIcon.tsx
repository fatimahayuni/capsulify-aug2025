import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProfileIcon = () => {
  const { user } = useUser();
  const router = useRouter();
  return (
    <div
      className="rounded-full"
      onClick={() => {
        router.push("/profile");
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
    </div>
  );
};

export default ProfileIcon;
