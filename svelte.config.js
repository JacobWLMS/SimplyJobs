import adapter from '@sveltejs/adapter-static';  // Changed from adapter-auto
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            fallback: 'index.html',
            precompress: false,
            strict: true
        }),
        paths: {
            base: process.env.NODE_ENV === 'production' ? '/SimplyJobs' : ''  // Make sure case matches your repository name exactly
        }
    }
};

export default config;