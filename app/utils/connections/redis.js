import { createClient } from 'redis';
require('dotenv').config();

const redisClient = createClient({
    url: `redis://default:nopass@redis-server:6379`
});

export default redisClient;
