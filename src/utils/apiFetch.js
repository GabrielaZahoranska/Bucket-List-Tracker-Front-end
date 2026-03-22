/**
 * Fetch with retry and extended timeout for Render free tier cold starts.
 * Retries up to 3 times with 60s timeout per attempt.
 */
export async function apiFetch(url, options = {}, retries = 3) {
  const timeout = 60000; // 60s for cold start
  for (let i = 0; i < retries; i++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return res;
    } catch (err) {
      clearTimeout(id);
      if (i === retries - 1) {
        throw err.name === 'AbortError'
          ? new Error('Server is starting up. Please wait a minute and try again.')
          : err;
      }
      await new Promise((r) => setTimeout(r, 2000)); // wait before retry
    }
  }
}
