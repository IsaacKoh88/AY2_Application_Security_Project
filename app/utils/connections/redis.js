import { createClient } from 'redis';
require('dotenv').config();

const redisClient = createClient({
    url: `redis://default:nopass@localhost:6379`
});

export default redisClient;
