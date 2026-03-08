import { useState, useEffect } from 'react';
import styles from './ExperienceForm.module.css';

export default function ExperienceForm({ initial, onSubmit, onCancel }) {
  const [date, setDate] = useState('');
  const [update, setUpdate] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState('');
  const [feeling, setFeeling] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      setDate(initial.date ? initial.date.slice(0, 10) : new Date().toISOString().slice(0, 10));
      setUpdate(initial.update || '');
      setLocation(initial.location || '');
      setNotes(initial.notes || '');
      setRating(initial.rating != null ? String(initial.rating) : '');
      setFeeling(initial.feeling || '');
    } else {
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [initial]);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const body = {
      date: date || new Date().toISOString(),
      update,
      location,
      notes,
      feeling,
    };
    if (rating) body.rating = Number(rating);
    onSubmit(body)
      .catch((err) => setError(err.message))
      .finally(() => setSubmitting(false));
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>{initial ? 'Edit update' : 'Add update'}</h3>
      {error && <p className={styles.errorMessage} role="alert">{error}</p>}
      <label htmlFor="exp-date" className={styles.label}>Date</label>
      <input
        id="exp-date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className={styles.input}
      />
      <label htmlFor="exp-update" className={styles.label}>Update / story</label>
      <textarea
        id="exp-update"
        value={update}
        onChange={(e) => setUpdate(e.target.value)}
        rows={3}
        placeholder="What happened?"
        className={styles.textarea}
      />
      <label htmlFor="exp-location" className={styles.label}>Location</label>
      <input
        id="exp-location"
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Where?"
        className={styles.input}
      />
      <label htmlFor="exp-notes" className={styles.label}>Notes</label>
      <textarea
        id="exp-notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        className={styles.textarea}
      />
      <label htmlFor="exp-rating" className={styles.label}>Rating (1–5)</label>
      <input
        id="exp-rating"
        type="number"
        min={1}
        max={5}
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        placeholder="Optional"
        className={styles.input}
      />
      <label htmlFor="exp-feeling" className={styles.label}>Feeling</label>
      <input
        id="exp-feeling"
        type="text"
        value={feeling}
        onChange={(e) => setFeeling(e.target.value)}
        placeholder="How did it feel?"
        className={styles.input}
      />
      <div className={styles.formActions}>
        <button type="button" className={styles.btnGhost} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.btnPrimary} disabled={submitting}>
          {submitting ? 'Saving…' : initial ? 'Save' : 'Add update'}
        </button>
      </div>
    </form>
  );
}
