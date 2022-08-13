import redisClient from "./connections/redis";

export default async function tokenBlacklistCheck(token: string) {
    const keyBlacklisted = await redisClient.executeIsolated(async isolatedClient => {
        return await isolatedClient.exists('bl_'+token);
    })

    return keyBlacklisted
}