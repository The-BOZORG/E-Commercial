import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';

import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class EmailVerificationService {
  private readonly expiration = 60 * 10; // 10 minutes

  constructor(private readonly redisService: RedisService) {}

  async createToken(userId: string): Promise<string> {
    const token = randomBytes(32).toString('hex');

    await this.redisService.getClient().set(this.getKey(token), userId, {
      EX: this.expiration,
    });

    return token;
  }

  async verifyToken(token: string): Promise<string | null> {
    const userId = await this.redisService.getClient().get(this.getKey(token));

    if (!userId) {
      return null;
    }

    await this.deleteToken(token);

    return userId;
  }

  private async deleteToken(token: string): Promise<void> {
    await this.redisService.getClient().del(this.getKey(token));
  }

  private getKey(token: string): string {
    return `email-verification:${token}`;
  }
}
