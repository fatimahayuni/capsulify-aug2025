"use client";
import { SignedOut, SignInButton, SignUpButton, useAuth, useUser } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import { getUserByClerkId, createUser } from "@/app/lib/actions/user.actions";
import { BODY_TYPE_ID } from "./constants";

export default function Home() {
  const router = useRouter();
  const { isSignedIn: isClerkSignedIn, userId: clerkId } = useAuth();
  const { user: clerkUser } = useUser();

  useEffect(() => {
    if (isClerkSignedIn) {
      const checkOnboarded = async () => {

        try {
          const user = await getUserByClerkId(clerkId!);

          if (!user) {
            // User was not found in the database, create them with clerk data.
            try {
              if (!clerkUser) {
                console.error("Clerk user data not available");
                return;
              }

              await createUser({
                name: `${clerkUser.firstName} ${clerkUser.lastName || ''}`,
                username: clerkUser.username || '',
                email: clerkUser.emailAddresses[0].emailAddress,
                clerkId: clerkId!,
              });

              router.push("/onboarding");
            } catch (error) {
              console.error("Error creating user:", error);
            }
            return;
          }

          if (user.onboarded === false) {
            router.push("/onboarding");
          } else {
            router.push("/inventory");
          }
        } catch (error) {
          console.error("Error in user check:", error);
        }
      };
      checkOnboarded();
    }
  }, [isClerkSignedIn, router, clerkId, clerkUser]);

	return (
		<div className='home-container'>
			<div className='home-content'>
				<div className='logo-content'>
					<img
						src={'/assets/images/logo/logo.svg'}
						alt='Capsulify Logo'
						className='logo'
					/>
					<h1 className='logo-text'>CAPSULIFY</h1>
				</div>
				<h1 className='home-title'>
					Style that attracts what <span>you</span> desire.
				</h1>
				<p className='home-subtitle'>
					We'll help you curate a capsule wardrobe designed for your
					shape - and the next era of your life!
				</p>
				<div className='flex justify-center gap-4'>
					<SignedOut>
						<SignInButton>
							<button className='cursor-pointer bg-accent text-white font-semibold py-3 px-8 rounded-lg shadow-md min-w-[120px] text-sm tracking-wide transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5'>
								Log In
							</button>
						</SignInButton>

						<SignUpButton>
							<button className='cursor-pointer bg-accent text-white font-semibold py-3 px-8 rounded-lg shadow-md min-w-[120px] text-sm tracking-wide transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5'>
								Register
							</button>
						</SignUpButton>
					</SignedOut>
				</div>
			</div>
		</div>
	)
}
