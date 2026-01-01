// In development (Vite), we need to point to the API server port.
// In production (served by Express), we use relative paths.
const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:3000' : '';

export default API_BASE_URL;
