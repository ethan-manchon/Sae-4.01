import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
 base: "/~manchon3/CycleD/Sae-4.01/frontend/dist/",
  plugins: [react(), tailwindcss()],  
  preview: {
   port: 5173,
   strictPort: true,
  },
  server: {
   port: 5173,
   strictPort: true,
   host: true,
   origin: "http://localhost:8090",
   allowedHosts: ["sae-frontend"]
  },
});

