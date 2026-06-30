import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Pengaturan penting untuk pengguna Termux
    host: true, 
    port: 5173,
  },
})
