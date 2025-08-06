import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import  { analyzer }  from 'vite-bundle-analyzer';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      'ac340d9981e7.ngrok-free.app'
    ]
  },
  plugins: [
    react(),
    // analyzer(),
    visualizer({
      filename: './dist/bundle-report.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }) as PluginOption,
  ].filter(Boolean),
   base: '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lodash')) {
              console.log('Lodash detected in:', id);
              return 'vendor_lodash';
            }
            if (id.includes('some-large-lib')) {
              console.log('Large library detected in:', id);
              return 'vendor_large_lib';
            }
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },

}));
