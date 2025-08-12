// // import { defineConfig } from 'vite'
// // import react from '@vitejs/plugin-react'

// // // https://vite.dev/config/
// // export default defineConfig({
// //   plugins: [react()],
// // })
// // vite.config.ts
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'https://getta-api.deployment-uat.com/api/v1', // your backend domain
//         changeOrigin: true,
//         secure: false,
//         rewrite: (path) => path.replace(/^\/api/, ''),
//       },
      
//     },
//   },
  
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: false, // disables TypeScript checking
      eslint: false      // optional: disables ESLint checking too
    })
  ],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: ['getta-web.deployment-uat.com'],
    proxy: {
      '/api': {
        target: 'https://getta-api-new.deployment-uat.com/api/v1/',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
