// components/HomePage.tsx
import React from 'react';
import styles from '../styles/homePage.module.css';

interface HomePageProps {
    onGetStartedClick: () => void; // Defining the type of onGetStartedClick as a function that returns void
  }  

const HomePage: React.FC<HomePageProps> = ({ onGetStartedClick }) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>Angel</div>
        <div className={styles.navLinks}>
          <button className={`${styles.button} ${styles.learnMore}`}>Learn More</button>
          <button className={`${styles.button} ${styles.getStarted}`} onClick={onGetStartedClick}>Get Started</button>
        </div>
      </header>
      <main className={styles.mainContent}>
        <h1 className={styles.title}>
          Effortlessly secure <br /> your code
        </h1>
        <p className={styles.description}>
          Unveil the full potential of your code with our <br /> cutting-edge performance, security, and maintainability analysis tool.
        </p>
      </main>
    </div>
  );
};

export default HomePage;
