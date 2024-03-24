import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";


export default function TopBar() {
    const { isLoaded: userLoaded, isSignedIn, user } = useUser();
    const router = useRouter();

    return (
        <div className="flex items-center justify-between w-full px-4 py-2 bg-white/10">
            <button onClick={() => router.push('/')}
                className="text-white hover:text-blue-500 transition-colors">
                <h1 className="text-xl font-bold text-black">ANGEL</h1>
            </button>
            {!isSignedIn && <SignInButton />}
            {isSignedIn && <UserButton appearance={{
                elements: {
                    userButtonAvatarBox: {
                        width: 42,
                        height: 42
                    }
                }
            }} />}
        </div>
    );
}