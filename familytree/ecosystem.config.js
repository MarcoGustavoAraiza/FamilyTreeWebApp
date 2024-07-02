module.exports = {
    apps: [
      {
        name: 'vite-app-dev',
        script: 'npm',
        args: 'run dev',
        env: {
          NODE_ENV: 'development'
        }
      }
    ]
  };
  