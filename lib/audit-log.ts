import { Prisma } from '@prisma/client';
import { prisma } from './prisma';

type AuditAction =
  | 'api.chat'
  | 'api.analyze'
  | 'api.generate'
  | 'case.create'
  | 'case.update'
  | 'case.delete'
  | 'document.create'
  | 'document.update'
  | 'document.delete';

interface AuditEntry {
  action: AuditAction;
  userId: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

export function auditLog(entry: AuditEntry) {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({ level: 'audit', timestamp, ...entry }));

  prisma.auditLog.create({
    data: {
      action: entry.action,
      userId: entry.userId,
      ip: entry.ip,
      userAgent: entry.userAgent,
      metadata: (entry.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
    },
  }).catch((err: unknown) => {
    console.error('[AuditLog] Failed to persist:', err instanceof Error ? err.message : 'unknown');
  });
}
