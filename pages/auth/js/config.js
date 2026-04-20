/**
 * Path4Career Frontend Configuration
 * Central configuration for API connectivity.
 *
 * Backend runs on port 8080 (Spring Boot - unified).
 * Frontend runs on port 5500 (live-server).
 */

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:8080' 
    : 'https://path4career-backend.onrender.com';
