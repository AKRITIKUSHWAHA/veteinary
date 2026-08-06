import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = (env.VITE_API_URL || 'http://localhost:5001').replace(/\/$/, '');

  return {
    plugins: [
      react(),
      {
        name: 'replace-api-url',
        transform(code, id) {
          if (id.includes('/src/') && (id.endsWith('.js') || id.endsWith('.jsx'))) {
            return {
              code: code.replace(/http:\/\/localhost:5000/g, apiUrl).replace(/http:\/\/localhost:5001/g, apiUrl),
              map: null
            };
          }
        }
      }
    ],
    server: {
      port: 5174,
      open: true
    },
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react':    ['react', 'react-dom', 'react-router-dom'],
            'vendor-recharts': ['recharts'],
            'vendor-lucide':   ['lucide-react'],
          }
        }
      }
    }
  };
})

