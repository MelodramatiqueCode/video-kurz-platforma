module.exports = {
  apps: [
    {
      name: "video-kurz-platforma",
      script: ".next/standalone/server.js",
      cwd: "/var/www/video-kurz-platforma",
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        HOSTNAME: "127.0.0.1",
      },
    },
  ],
};
