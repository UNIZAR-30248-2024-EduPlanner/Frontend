import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "https://unizar-30248-2024-eduplanner.github.io/Frontend/EduPlanner/"
})
