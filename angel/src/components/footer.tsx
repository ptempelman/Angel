// components/Footer.tsx
import React, { forwardRef } from 'react';
import styles from '../styles/footer.module.css'; // Make sure the path to your CSS module is correct

// Import your logos here
import logoService1 from '~/components/github_logo-removebg.png';
import logoService2 from '~/components/gitlab_white.png';

const Footer = forwardRef<HTMLDivElement, {}>((props, ref) => {
  return (
    <footer ref={ref} className={styles.footer}>
      <div className={styles.logoContainer}>
        {/* Replace img src with your imported logo variables */}
        <img src={logoService1.src} alt="Service 1 Logo" className={styles.logo} />
        <img src={logoService2.src} alt="Service 2 Logo" className={styles.logo} />
        {/* Add more logos as needed */}
      </div>
    </footer>
  );
});

export default Footer;
