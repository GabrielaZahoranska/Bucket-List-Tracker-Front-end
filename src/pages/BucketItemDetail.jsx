import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as bucketItemService from '../services/bucketItemService';
import * as experienceService from '../services/experienceService';
import BucketItemForm from '../components/BucketItemForm';
import ExperienceForm from '../components/ExperienceForm';
import styles from './BucketItemDetail.module.css';

const CATEGORIES = ['travel', 'fitness', 'career', 'personal', 'adventure'];
const STATUS_LABELS = { dreaming: 'Dreaming', planning: 'Planning', done: 'Done' };

export default function BucketItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState(null);

  function load() {
    if (!id) return;
    setLoading(true);
    Promise.all([
      bucketItemService.show(id),
      bucketItemService.indexExperiences(id),
    ])
      .then(([itemData, expData]) => {
        setItem(itemData);
        setExperiences(expData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => load(), [id]);

  function handleUpdateGoal(body) {
    return bucketItemService.update(id, body).then(() => {
      setEditing(false);
      load();
    });
  }

  function handleAddExperience(body) {
    return bucketItemService.createExperience(id, body).then(() => {
      setShowExperienceForm(false);
      load();
    });
  }

  function handleUpdateExperience(expId, body) {
    return experienceService.update(expId, body).then(() => {
      setEditingExperienceId(null);
      load();
    });
  }

  function handleDeleteExperience(expId) {
    if (!window.confirm('Delete this experience?')) return;
    experienceService.deleteExperience(expId).then(load).catch((err) => setError(err.message));
  }

  const editingExperience = editingExperienceId
    ? experiences.find((e) => e._id === editingExperienceId)
    : null;

  if (loading) return <div className={styles.loadingScreen}>Loading goal…</div>;
  if (error || !item) return <p className={styles.errorMessage}>{error || 'Goal not found.'}</p>;

  return (
    <div>
      <p className={styles.breadcrumb}>
        <Link to="/goals">My goals</Link> → {item.title}
      </p>
      {!editing ? (
        <div className={styles.goalDetailCard}>
          <div className={styles.goalDetailHeader}>
            <h1>{item.title}</h1>
            <span className={`${styles.badge} ${styles[`badge${item.status.charAt(0).toUpperCase() + item.status.slice(1)}`]}`}>
              {STATUS_LABELS[item.status] || item.status}
            </span>
            <span className={styles.goalCategory}>{item.category}</span>
            <button
              type="button"
              className={styles.btn}
              onClick={() => setEditing(true)}
            >
              Edit goal
            </button>
          </div>
          {item.description && <p className={styles.goalDesc}>{item.description}</p>}
          {(item.targetYear || item.targetDate) && (
            <p className={styles.goalMeta}>
              Target: {item.targetDate
                ? new Date(item.targetDate).toLocaleDateString()
                : item.targetYear || '—'}
            </p>
          )}
        </div>
      ) : (
        <BucketItemForm
          categories={CATEGORIES}
          initial={item}
          onSubmit={handleUpdateGoal}
          onCancel={() => setEditing(false)}
        />
      )}
      <section className={styles.experiencesSection} aria-label="Progress and memories">
        <h2>Progress & memories</h2>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={() => { setShowExperienceForm(true); setEditingExperienceId(null); }}
        >
          Add update
        </button>
        {showExperienceForm && !editingExperienceId && (
          <ExperienceForm
            onSubmit={handleAddExperience}
            onCancel={() => setShowExperienceForm(false)}
          />
        )}
        {editingExperience && (
          <ExperienceForm
            initial={editingExperience}
            onSubmit={(body) => handleUpdateExperience(editingExperienceId, body)}
            onCancel={() => setEditingExperienceId(null)}
          />
        )}
        <ul className={styles.timeline}>
          {experiences.length === 0 && !showExperienceForm && !editingExperience && (
            <li className={styles.timelineEmpty}>No updates yet. Add one to track your journey.</li>
          )}
          {experiences.map((entry) => (
            <li key={entry._id} className={styles.timelineItem}>
              <div className={styles.timelineDate}>
                {new Date(entry.date).toLocaleDateString()}
              </div>
              <div className={styles.timelineContent}>
                {entry.update && <p>{entry.update}</p>}
                {entry.location && <p className={styles.timelineLocation}>{entry.location}</p>}
                {entry.notes && <p className={styles.timelineNotes}>{entry.notes}</p>}
                {entry.rating != null && (
                  <p className={styles.timelineRating}>Rating: {entry.rating}/5</p>
                )}
                {entry.feeling && <p className={styles.timelineFeeling}>{entry.feeling}</p>}
                {entry.photos?.length > 0 && (
                  <ul className={styles.timelinePhotos}>
                    {entry.photos.map((url, i) => (
                      <li key={i}>
                        <img src={url} alt={`Experience ${i + 1}`} />
                      </li>
                    ))}
                  </ul>
                )}
                <div className={styles.timelineActions}>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSmall}`}
                    onClick={() => { setEditingExperienceId(entry._id); setShowExperienceForm(false); }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSmall} ${styles.btnDanger}`}
                    onClick={() => handleDeleteExperience(entry._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
