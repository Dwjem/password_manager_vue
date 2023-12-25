import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/password_manager_vue/",
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@store': fileURLToPath(new URL('./src/store', import.meta.url)),
      '@router': fileURLToPath(new URL('./src/router', import.meta.url)),
      '@view': fileURLToPath(new URL('./src/view', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@style': fileURLToPath(new URL('./src/style', import.meta.url)),
      '@comp': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@types': fileURLToPath(new URL('./src/types', import.meta.url))
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/styles/public/color.scss";' //引入scss文件
      }
    }
  }
})
