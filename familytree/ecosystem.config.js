module.exports = {
    apps: [
      {
        name: 'vite-app-dev',
        script: 'npx',
        args: 'vite',
        env: {
          NODE_ENV: 'development'
        }
      }
    ]
  };
  