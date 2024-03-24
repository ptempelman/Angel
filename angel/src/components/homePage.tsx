import React from 'react';
import Image from 'next/image';
import { useClerk } from '@clerk/clerk-react';
import styles from '../styles/homePage.module.css';

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  const { openSignIn } = useClerk();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>Angel</div>
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
