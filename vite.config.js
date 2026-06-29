import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		host: true,
		port: 5173,
		allowedHosts: ['odometrical-callum-veridically.ngrok-free.dev', '0.0.0.0']
	},build: {
        rollupOptions: {
            external: ['@capacitor/navigation-bar', '@capacitor/app']
        }
    },
	optimizeDeps: {
        exclude: ['@capacitor/navigation-bar', '@capacitor/app']
    }
});
