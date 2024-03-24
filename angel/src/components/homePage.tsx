import { useClerk } from '@clerk/clerk-react';
import Image from 'next/image';
import React from 'react';
import logo from '../../public/logo2.png';
import styles from '../styles/homePage.module.css';

interface HomePageProps { }

const HomePage: React.FC<HomePageProps> = () => {
  const { openSignIn } = useClerk();

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
    <div className={styles.container}>
      <header className={styles.header}>
        <div className="w-3/6 mt-4 ml-4 flex">
          <Image src={logo} alt="Logo" width={40} height={40} />
          <h1 className="text-3xl font-bold ml-2" style={gradientTextStyle}>ANGEL</h1>

        </div>
        <div className={styles.navLinks}>
          <button className={`${styles.button} ${styles.learnMore}`}>Learn More</button>
          <button className={`${styles.button} ${styles.getStarted}`} onClick={() => openSignIn()}>Get Started</button>
        </div>
      </header>
      <div className={styles.columns}>
        <div className={styles.columnText}>
          <h1 className={styles.title}>
            Effortlessly secure your code
          </h1>
          <p className={styles.description}>
            Unveil the full potential of your code with our cutting-edge performance, security, and maintainability analysis tool.
          </p>
        </div>
        <div className={styles.columnGif}>
          <Image
            src="/images/demo_2-ezgif.com-video-to-gif-converter.gif"
            alt="Animated demonstration"
            width={960}  // Increased width
            height={720} // Increased height
            layout="responsive"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
