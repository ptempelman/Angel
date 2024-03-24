// components/Footer.tsx
import React, { forwardRef } from 'react';
import styles from '../styles/footer.module.css';

const Footer = forwardRef<HTMLDivElement, {}>((props, ref) => {
  return (
    <footer ref={ref} className={styles.footer}>
      <div className={styles.logoContainer}>
        {/* Use the public path directly in the src attribute */}
        <img src="/images/github_logo-removebg-removebg-preview.png" alt="Service 1 Logo" className={styles.logo} />
        <img src="/images/gitlab_white-removebg-preview.png" alt="Service 2 Logo" className={styles.logo} />
        {/* Add more logos as needed */}
      </div>
    </footer>
  );
});

export default Footer;
