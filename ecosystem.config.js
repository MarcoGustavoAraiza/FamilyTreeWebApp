module.exports = {
    apps: [
      {
        name: 'vite-app',
        cwd: './familytree',  // Change to frontend directory
        script: 'npm',
        args: 'run dev',
        env: {
          NODE_ENV: 'development',
          PORT: 3000
        }
      },
      {
        name: 'backend',
        cwd: './backend',  // Change to backend directory
        script: 'server.js',
        env: {
          NODE_ENV: 'production',
          PORT: 5000
        }
      }
    ]
  };
  