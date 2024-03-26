import { LRUCache } from "lru-cache";

// from https://github.com/vercel/next.js/blob/canary/examples/api-routes-rate-limit/pages/api/user.ts

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function rateLimiter(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: (response: Response, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0]!;
        const isRateLimited = currentUsage >= limit;

        response.headers.set("X-RateLimit-Limit", String(limit));
        response.headers.set(
          "X-RateLimit-Remaining",
          String(isRateLimited ? 0 : limit - currentUsage)
        );

        return isRateLimited ? reject() : resolve();
      }),
  };
}
