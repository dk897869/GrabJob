const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');
const { startCronJobSync } = require('./services/cronSyncService');

const startServer = async () => {
  await connectDB();

  // Start 5-minute automated sync for LinkedIn, Indeed, Naukri jobs
  startCronJobSync();

  const server = app.listen(env.PORT, () => {
    console.log(`========================================`);
    console.log(`  GrabJob API Server Running            `);
    console.log(`  Port: ${env.PORT}                     `);
    console.log(`  Environment: ${env.NODE_ENV}          `);
    console.log(`  Health Check: http://localhost:${env.PORT}/api/health`);
    console.log(`========================================`);
  });

  process.on('unhandledRejection', (err) => {
    console.error(`[Unhandled Rejection]: ${err.message}`);
  });

  return server;
};

if (require.main === module) {
  startServer();
}

module.exports = { startServer };
