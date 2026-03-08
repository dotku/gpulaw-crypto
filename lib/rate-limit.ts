const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  ip: string,
  { limit = 60, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {}
): boolean {
  const now = Date.now();
  const entry = ipRequestCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    ipRequestCounts.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  entry.count++;
  return entry.count <= limit;
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipRequestCounts) {
    if (now > entry.resetAt) ipRequestCounts.delete(ip);
  }
}, 5 * 60_000);
