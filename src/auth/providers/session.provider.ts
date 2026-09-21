import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { RedisService } from 'src/redis/redis.service';

interface Session {
  userId: string;
  refreshTokenHash: string;
}

@Injectable()
export class SessionService {
  private readonly sessionExpiration = 60 * 60 * 24 * 7; // 7 days

  constructor(private readonly redisService: RedisService) {}

  async createSession(
    userId: string,
    refreshTokenHash: string,
  ): Promise<string> {
    const sessionId = randomUUID();

    const session: Session = {
      userId,
      refreshTokenHash,
    };

    await this.redisService.set(
      this.getSessionKey(sessionId),
      JSON.stringify(session),
      this.sessionExpiration,
    );

    return sessionId;
  }

  async getSession(sessionId: string): Promise<Session | null> {
    const session = await this.redisService.get(this.getSessionKey(sessionId));

    if (!session) {
      return null;
    }

    return JSON.parse(session) as Session;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.redisService.del(this.getSessionKey(sessionId));
  }

  private getSessionKey(sessionId: string): string {
    return `session:${sessionId}`;
  }
}
