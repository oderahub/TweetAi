import Queue from 'bull';

// Configuring the Bull queue with Redis
export const autobotQueue = new Queue('autobotQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});
