import { defineConfig } from 'vite'

export default defineConfig({
	build: {
		outDir: 'dist',
		assetsDir: 'assets',
		sourcemap: false,
		rollupOptions: {
			output: {
				entryFileNames: 'assets/[name].[hash].js',
				chunkFileNames: 'assets/[name].[hash].js',
				assetFileNames: 'assets/[name].[hash].[ext]',
			},
		},
	},
	base: './',
	server: {
		host: '0.0.0.0',
		port: 3000,
	},
})
