import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import * as fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
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
