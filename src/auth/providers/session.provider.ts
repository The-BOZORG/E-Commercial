import { Injectable } from '@nestjs/common';

import { RedisService } from 'src/redis/redis.service';
import { Session } from '../interface/interface.auth';

@Injectable()
export class SessionService {
  private readonly sessionExpiration = 60 * 60 * 24 * 7;

  constructor(private readonly redisService: RedisService) {}

  async createSession(
    sessionId: string,
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const session: Session = {
      userId,
      refreshToken,
    };

    await this.redisService
      .getClient()
      .set(`session:${sessionId}`, JSON.stringify(session), {
        EX: this.sessionExpiration,
      });
  }

  async getSession(sessionId: string): Promise<Session | null> {
    const data = await this.redisService
      .getClient()
      .get(`session:${sessionId}`);

    if (!data) {
      return null;
    }

    return JSON.parse(data) as Session;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.redisService.getClient().del(`session:${sessionId}`);
  }
}
