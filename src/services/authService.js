const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL || 'http://localhost:5001'}/api/auth`;

const signUp = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || data.message || 'Sign up failed');
    return data;
  } catch (error) {
    throw error;
  }
};

const signIn = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || data.message || 'Sign in failed');
    return data;
  } catch (error) {
    throw error;
  }
};

export { signUp, signIn };
