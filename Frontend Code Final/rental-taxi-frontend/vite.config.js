import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5174,         // Forces Vite to ALWAYS use port 5174
    hmr: {
      overlay: false    // Stops the annoying red browser overlays
    }
  },
  define: {
    global: 'window',   // Fixes the socket.io global error
  },
  // THIS IS THE LINE I ACCIDENTALLY REMOVED! It fixes the React Hook error.
  resolve: {
    dedupe: ['react', 'react-dom']
  }
})