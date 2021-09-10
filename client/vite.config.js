import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import * as fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        // https: {
        //     key: fs.readFileSync(`/etc/letsencrypt/live/${process.env.SSL_DOMAIN}/privkey.pem`),
        //     cert: fs.readFileSync(`/etc/letsencrypt/live/${process.env.SSL_DOMAIN}/cert.pem`),
        // },
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
