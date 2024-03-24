import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Image from 'next/image'
import logo from '../../public/logo2.png'

export default function TopBar() {
    const { isLoaded: userLoaded, isSignedIn, user } = useUser();
    const router = useRouter();

    // Dynamic gradient style for the text
    const gradientTextStyle = {
        background: 'linear-gradient(135deg, #948BD2, #B678BB, #FD5390)',
        backgroundSize: '200% 200%', // Enlarging the background size for the animation
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        MozBackgroundClip: 'text',
        MozTextFillColor: 'transparent',
        animation: 'gradientShift 3s ease infinite', // Applying the animation
        display: 'inline' // Required for background-clip in some browsers
    };

    return (
        <div className="flex items-center justify-between w-full px-4 py-2 bg-white/10">
            <button onClick={() => router.push('/')}
                className="text-white hover:text-blue-500 transition-colors">
                <Image src={logo} alt="Logo" width={40} height={40} />
                {/* Apply the dynamic gradientTextStyle here */}
                <h1 className="text-3xl font-bold" style={gradientTextStyle}>ANGEL</h1>
            </button>
            {!isSignedIn && <SignInButton />}
            {isSignedIn && <UserButton appearance={{
                elements: {
                    userButtonAvatarBox: {
                        width: 60,
                        height: 60
                    }
                }
            }} />}
        </div>
    );
}
