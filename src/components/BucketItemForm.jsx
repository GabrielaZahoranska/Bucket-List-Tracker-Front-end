import { useState, useEffect } from 'react';
import styles from './BucketItemForm.module.css';

export default function BucketItemForm({ categories, initial, onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories?.[0] || 'personal');
  const [priority, setPriority] = useState(1);
  const [targetYear, setTargetYear] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [status, setStatus] = useState('dreaming');
  const [visibility, setVisibility] = useState('private');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      setTitle(initial.title || '');
      setDescription(initial.description || '');
      setCategory(initial.category || 'personal');
      setPriority(initial.priority ?? 1);
      setTargetYear(initial.targetYear ? String(initial.targetYear) : '');
      setTargetDate(initial.targetDate ? initial.targetDate.slice(0, 10) : '');
      setStatus(initial.status || 'dreaming');
      setVisibility(initial.visibility || 'private');
    }
  }, [initial]);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const body = {
      title,
      description,
      category,
      priority: Number(priority) || 1,
      status,
      visibility,
    };
    if (targetYear) body.targetYear = Number(targetYear);
    if (targetDate) body.targetDate = targetDate;
    onSubmit(body)
      .catch((err) => setError(err.message))
      .finally(() => setSubmitting(false));
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>{initial ? 'Edit goal' : 'New goal'}</h2>
      {error && <p className={styles.errorMessage} role="alert">{error}</p>}
      <label htmlFor="goal-title" className={styles.label}>Title</label>
      <input
        id="goal-title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className={styles.input}
      />
      <label htmlFor="goal-description" className={styles.label}>Description</label>
      <textarea
        id="goal-description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        className={styles.textarea}
      />
      <label htmlFor="goal-category" className={styles.label}>Category</label>
      <select
        id="goal-category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className={styles.select}
      >
        {categories?.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <label htmlFor="goal-priority" className={styles.label}>Priority (1–5)</label>
      <input
        id="goal-priority"
        type="number"
        min={1}
        max={5}
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className={styles.input}
      />
      <label htmlFor="goal-targetYear" className={styles.label}>Target year</label>
      <input
        id="goal-targetYear"
        type="number"
        min={2020}
        max={2050}
        value={targetYear}
        onChange={(e) => setTargetYear(e.target.value)}
        placeholder="e.g. 2025"
        className={styles.input}
      />
      <label htmlFor="goal-targetDate" className={styles.label}>Target date</label>
      <input
        id="goal-targetDate"
        type="date"
        value={targetDate}
        onChange={(e) => setTargetDate(e.target.value)}
        className={styles.input}
      />
      <label htmlFor="goal-status" className={styles.label}>Status</label>
      <select
        id="goal-status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className={styles.select}
      >
        <option value="dreaming">Dreaming</option>
        <option value="planning">Planning</option>
        <option value="done">Done</option>
      </select>
      <label htmlFor="goal-visibility" className={styles.label}>Visibility</label>
      <select
        id="goal-visibility"
        value={visibility}
        onChange={(e) => setVisibility(e.target.value)}
        className={styles.select}
      >
        <option value="private">Private</option>
        <option value="public">Public</option>
      </select>
      <div className={styles.formActions}>
        <button type="button" className={styles.btnGhost} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.btnPrimary} disabled={submitting}>
          {submitting ? 'Saving…' : initial ? 'Save changes' : 'Create goal'}
        </button>
      </div>
    </form>
  );
}
