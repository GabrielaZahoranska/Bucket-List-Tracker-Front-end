import { useState } from 'react';
import { Link } from 'react-router-dom';
import BucketItemForm from '../components/BucketItemForm';
import styles from './BucketList.module.css';

const CATEGORIES = ['travel', 'fitness', 'career', 'personal', 'adventure'];
const STATUS_LABELS = { dreaming: 'Dreaming', planning: 'Planning', done: 'Done' };

export default function BucketList(props) {
  const { bucketItems, handleAddBucketItem, handleUpdateBucketItem, handleDeleteBucketItem } = props;
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const handleCreate = (body) => {
    return handleAddBucketItem(body)
      .then(() => setShowForm(false))
      .catch((err) => setError(err.message));
  };

  const handleUpdate = (id, body) => {
    return handleUpdateBucketItem(id, body)
      .then(() => setEditingId(null))
      .catch((err) => setError(err.message));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this goal and all its experiences?')) return;
    handleDeleteBucketItem(id).catch((err) => setError(err.message));
  };

  const editingItem = editingId ? bucketItems.find((i) => i._id === editingId) : null;

  return (
    <div className={styles.bucketListPage}>
      <h1 className={styles.bucketListTitle}>My Bucket List</h1>
      <button
        type="button"
        className={styles.btnAddGoal}
        onClick={() => { setShowForm(true); setEditingId(null); }}
      >
        Add New Goal
      </button>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {showForm && !editingId && (
        <BucketItemForm
          categories={CATEGORIES}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}
      {editingItem && (
        <BucketItemForm
          categories={CATEGORIES}
          initial={editingItem}
          onSubmit={(body) => handleUpdate(editingId, body)}
          onCancel={() => setEditingId(null)}
        />
      )}
      <div className={styles.goalsGrid}>
        {bucketItems.map((item) => (
          <div key={item._id} className={styles.goalCardApp}>
            <Link to={`/goals/${item._id}`} className={styles.goalCardTitle}>{item.title}</Link>
            <p className={styles.goalCardStatus}>
              Status: {STATUS_LABELS[item.status] || item.status}
            </p>
            <div className={styles.goalCardButtons}>
              <button
                type="button"
                className={styles.btnCard}
                onClick={() => { setEditingId(item._id); setShowForm(false); }}
              >
                Edit
              </button>
              <button
                type="button"
                className={styles.btnCard}
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {bucketItems.length === 0 && !showForm && (
        <p className={styles.bucketListEmpty}>No goals yet. Click &quot;Add New Goal&quot; to create your first bucket list item.</p>
      )}
    </div>
  );
}
