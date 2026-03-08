const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL || 'http://localhost:5001'}/api/experiences`;

const show = async (experienceId) => {
  try {
    const res = await fetch(`${BASE_URL}/${experienceId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || data.message || 'Request failed');
    return data;
  } catch (error) {
    throw error;
  }
};

const update = async (experienceId, experienceFormData) => {
  try {
    const res = await fetch(`${BASE_URL}/${experienceId}`, {
      method: 'PUT',
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

const deleteExperience = async (experienceId) => {
  try {
    const res = await fetch(`${BASE_URL}/${experienceId}`, {
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

export { show, update, deleteExperience };
