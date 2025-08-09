import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.app",
  appName: "todo-list-app",
  webDir: "dist",
  server: {
    url: "http://192.168.43.186:5173/",
    cleartext: true,
  },
};

export default config;
