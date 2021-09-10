import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        hmr: {
            protocol: 'ws'
        },
        host: '0.0.0.0',
        port: process.env.PORT || 4000,
        proxy: {
            '/api': {
                target: process.env.TARGET_URL,
                changeOrigin: true,
                secure: true
            }
        }
    }
})
