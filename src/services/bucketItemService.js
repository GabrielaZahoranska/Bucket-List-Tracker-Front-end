import { apiFetch } from '../utils/apiFetch';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL || 'http://localhost:5001'}/api/bucketitems`;

const index = async () => {
  try {
    const res = await apiFetch(BASE_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || data.message || 'Request failed');
    return data;
  } catch (error) {
    throw error;
  }
};

const show = async (bucketItemId) => {
  try {
    const res = await apiFetch(`${BASE_URL}/${bucketItemId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || data.message || 'Request failed');
    return data;
  } catch (error) {
    throw error;
  }
};

const create = async (bucketItemFormData) => {
  try {
    const res = await apiFetch(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bucketItemFormData),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || data.message || 'Request failed');
    return data;
  } catch (error) {
    throw error;
  }
};

const update = async (bucketItemId, bucketItemFormData) => {
  try {
    const res = await apiFetch(`${BASE_URL}/${bucketItemId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bucketItemFormData),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || data.message || 'Request failed');
    return data;
  } catch (error) {
    throw error;
  }
};

const deleteBucketItem = async (bucketItemId) => {
  try {
    const res = await apiFetch(`${BASE_URL}/${bucketItemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || data.message || 'Delete failed');
    }
    return res.status === 204 ? {} : res.json();
  } catch (error) {
    throw error;
  }
};

const stats = async () => {
  try {
    const res = await apiFetch(`${BASE_URL}/stats`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || data.message || 'Request failed');
    return data;
  } catch (error) {
    throw error;
  }
};

const indexExperiences = async (bucketItemId) => {
  try {
    const res = await apiFetch(`${BASE_URL}/${bucketItemId}/experiences`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || data.message || 'Request failed');
    return data;
  } catch (error) {
    throw error;
  }
};

const createExperience = async (bucketItemId, experienceFormData) => {
  try {
    const res = await apiFetch(`${BASE_URL}/${bucketItemId}/experiences`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(experienceFormData),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || data.message || 'Request failed');
    return data;
  } catch (error) {
    throw error;
  }
};

export {
  index,
  show,
  create,
  update,
  deleteBucketItem,
  stats,
  indexExperiences,
  createExperience,
};
