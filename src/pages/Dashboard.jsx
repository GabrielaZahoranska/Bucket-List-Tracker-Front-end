import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as bucketItemService from '../services/bucketItemService';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchStats = async () => {
      try {
        const data = await bucketItemService.stats();
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    if (user) fetchStats();
    else setLoading(false);
    return () => { cancelled = true; };
  }, [user]);

  if (loading) return <div className={styles.loadingScreen}>Loading dashboard…</div>;
  if (error) return <p className={styles.errorMessage}>{error}</p>;

  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>
      <section className={styles.statsGrid} aria-label="Summary statistics">
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats?.goalsCompleted ?? 0}</span>
          <span className={styles.statLabel}>Goals completed</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats?.goalsInProgress ?? 0}</span>
          <span className={styles.statLabel}>In progress</span>
        </div>
        <div className={`${styles.statCard} ${styles.statCardHighlight}`}>
          <span className={styles.statValue}>{stats?.completionPercentage ?? 0}%</span>
          <span className={styles.statLabel}>Completion</span>
        </div>
      </section>
      <section className={styles.recentActivity} aria-label="Recent activity">
        <h2>Recent activity</h2>
        {stats?.recentActivity?.length > 0 ? (
          <ul className={styles.activityList}>
            {stats.recentActivity.map((entry) => (
              <li key={entry._id}>
                <Link to={`/goals/${entry.bucketItem?._id}`}>
                  <strong>{entry.bucketItem?.title}</strong>: {entry.update || 'Update'} —{' '}
                  {new Date(entry.date).toLocaleDateString()}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No activity yet. <Link to="/goals">Add a goal</Link> or log an experience.</p>
        )}
      </section>
      <p className={styles.dashboardActions}>
        <Link to="/goals" className={styles.btnPrimary}>View all goals</Link>
      </p>
    </div>
  );
}
