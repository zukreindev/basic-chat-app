import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import Pages from 'vite-plugin-pages';

export default defineConfig({
    plugins: [
        Vue(),
        Pages({
            dirs: [{ baseRoute: '/', dir: './src/pages' }],
        }),
    ],
    build: {
        assetsDir: '__data',
        chunkSizeWarningLimit: 10000,
        cssCodeSplit: true,
    },
    envDir: './',
});
