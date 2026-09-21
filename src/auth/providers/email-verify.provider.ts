import { Injectable } from '@nestjs/common';
import { createHash, randomInt, timingSafeEqual } from 'node:crypto';

import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class EmailVerificationService {
  private readonly expiration = 60 * 10; // 10 minutes

  constructor(private readonly redisService: RedisService) {}

  async createCode(userId: string): Promise<string> {
    const code = randomInt(100000, 1000000).toString();

    const codeHash = this.hash(code);

    await this.redisService.getClient().set(this.getKey(userId), codeHash, {
      EX: this.expiration,
    });

    return code;
  }

  async verifyCode(userId: string, code: string): Promise<boolean> {
    const storedHash = await this.redisService
      .getClient()
      .get(this.getKey(userId));

    if (!storedHash) {
      return false;
    }

    const codeHash = this.hash(code);

    const codeBuffer = Buffer.from(codeHash, 'hex');
    const storedBuffer = Buffer.from(storedHash, 'hex');

    if (codeBuffer.length !== storedBuffer.length) {
      return false;
    }

    const isValid = timingSafeEqual(codeBuffer, storedBuffer);

    if (isValid) {
      await this.deleteCode(userId);
    }

    return isValid;
  }

  async deleteCode(userId: string): Promise<void> {
    await this.redisService.getClient().del(this.getKey(userId));
  }

  private hash(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }

  private getKey(userId: string): string {
    return `email-verification:${userId}`;
  }
}
