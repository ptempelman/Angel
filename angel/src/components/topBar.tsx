import { SignInButton, UserButton, useUser } from "@clerk/nextjs";


export default function TopBar() {
    const { isLoaded: userLoaded, isSignedIn, user } = useUser();

    return (
        <div className="flex items-center justify-between w-full px-4 py-2 bg-white/10">
            <h1 className="text-xl font-bold text-black">KnowFlow</h1>
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