type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count };
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function rateLimitResponse(retryAfterMs: number) {
  return new Response(JSON.stringify({ error: "Príliš veľa požiadaviek. Skúste neskôr." }), {
    status: 429,
    headers: {
      "Content-Type": "application/json",
      "Retry-After": String(Math.ceil(retryAfterMs / 1000)),
    },
  });
}

export function enforceRateLimit(request: Request, scope: string, limit: number, windowMs: number) {
  const ip = getClientIp(request);
  const result = rateLimit(`${scope}:${ip}`, limit, windowMs);
  if (!result.allowed) {
    return rateLimitResponse(result.retryAfterMs ?? windowMs);
  }
  return null;
}
