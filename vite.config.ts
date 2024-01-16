import uni from '@dcloudio/vite-plugin-uni'
import { defineConfig } from 'vite'

const isProd = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: isProd
      }
    }
  }
})
