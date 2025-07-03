import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'process'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    // IMPORTANT: Set this to your repository name for GitHub Pages deployment.
    // For example, if your repo URL is https://github.com/your-user/math-whiz-kids,
    // you should set base to '/math-whiz-kids/'.
    // If you are deploying to a custom domain or the root of github.io, you can use '/'.
    base: '/math-whiz-kids/',
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    build: {
      chunkSizeWarningLimit: 1000, // For larger assets like fonts in jsPDF
    }
  }
})
