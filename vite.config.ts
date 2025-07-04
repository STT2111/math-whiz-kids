import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // `loadEnv` loads env variables from .env files in the project root.
  const env = loadEnv(mode, '.', '');

  // The final API key will be taken from the build environment's process.env
  // (like in GitHub Actions secrets) and fallback to the .env file for local development.
  const apiKey = process.env.API_KEY || env.API_KEY;

  return {
    plugins: [react()],
    // IMPORTANT: Set this to your repository name for GitHub Pages deployment.
    // For example, if your repo URL is https://github.com/your-user/math-whiz-kids,
    // you should set base to '/math-whiz-kids/'.
    // If you are deploying to a custom domain or the root of github.io, you can use '/'.
    base: '/math-whiz-kids/',
    define: {
      // Vite will replace `process.env.API_KEY` with the value of `apiKey`.
      // It's crucial to JSON.stringify the value so it's injected as a string.
      'process.env.API_KEY': JSON.stringify(apiKey)
    },
    build: {
      chunkSizeWarningLimit: 1000, // For larger assets like fonts in jsPDF
    }
  }
})
