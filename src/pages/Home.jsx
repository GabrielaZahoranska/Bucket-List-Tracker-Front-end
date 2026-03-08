import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Home.module.css';

export default function Home() {
  const { isLoggedIn } = useAuth();

  return (
    <main className={styles.landingPage}>
      <div className={styles.landingContent}>
        <h1>Bucket List App</h1>
        <hr className={styles.landingDivider} />
        <p className={styles.landingTagline}>Achieve Your Dreams!</p>
        {isLoggedIn ? (
          <Link to="/dashboard" className={`${styles.btnLanding} ${styles.btnLandingPrimary}`}>Go to dashboard</Link>
        ) : (
          <div className={styles.landingActions}>
            <Link to="/signup" className={`${styles.btnLanding} ${styles.btnLandingPrimary}`}>Sign Up</Link>
            <Link to="/login" className={`${styles.btnLanding} ${styles.btnLandingSecondary}`}>Log In</Link>
          </div>
        )}
      </div>
    </main>
  );
}
