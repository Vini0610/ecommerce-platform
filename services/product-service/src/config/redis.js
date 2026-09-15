const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis client connected');
  } catch (error) {
    console.error('Error connecting to Redis', error);
  }
};

module.exports = { redisClient, connectRedis };