import {defineConfig} from 'vite'
import preact from '@preact/preset-vite'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), tailwindcss()],
  resolve: {
    alias: {
      'react': resolve(__dirname, 'node_modules/preact/compat'),
      'react-dom': resolve(__dirname, 'node_modules/preact/compat'),
      'react/jsx-runtime': resolve(__dirname, 'node_modules/preact/jsx-runtime'),
    }
  }
})
