import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className={`${styles.layout} ${styles.appLayout}`}>
      <header className={styles.appHeader}>
        <nav className={styles.appNav} aria-label="Main navigation">
          <Link to="/dashboard">Home</Link>
          <Link to="/goals">My Goals</Link>
          <button type="button" className={styles.appLogout} onClick={handleLogout}>
            Log Out
          </button>
        </nav>
      </header>
      <main className={styles.appMain}>{children}</main>
    </div>
  );
}
