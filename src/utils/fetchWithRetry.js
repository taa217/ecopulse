/**
 * Fetch with retry — handles the race condition where the backend
 * server hasn't started yet and the Vite proxy returns ECONNREFUSED.
 *
 * Retries up to `maxRetries` times with exponential back-off.
 */
export async function fetchWithRetry(url, options = {}, maxRetries = 3) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const res = await fetch(url, options);
            return res;
        } catch (err) {
            if (attempt === maxRetries) throw err;
            // Wait with exponential back-off: 500ms, 1000ms, 2000ms …
            await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
        }
    }
}
