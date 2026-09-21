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

    await this.redisService.set(this.getKey(userId), codeHash, this.expiration);

    return code;
  }

  async verifyCode(userId: string, code: string): Promise<boolean> {
    const storedHash = await this.redisService.get(this.getKey(userId));

    if (!storedHash) {
      return false;
    }

    const isValid = this.compare(code, storedHash);

    if (isValid) {
      await this.deleteCode(userId);
    }

    return isValid;
  }

  async deleteCode(userId: string): Promise<void> {
    await this.redisService.del(this.getKey(userId));
  }

  private hash(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }

  private compare(value: string, hashedValue: string): boolean {
    const valueHash = this.hash(value);

    const valueBuffer = Buffer.from(valueHash, 'hex');
    const hashedValueBuffer = Buffer.from(hashedValue, 'hex');

    if (valueBuffer.length !== hashedValueBuffer.length) {
      return false;
    }

    return timingSafeEqual(valueBuffer, hashedValueBuffer);
  }

  private getKey(userId: string): string {
    return `email-verification:${userId}`;
  }
}
