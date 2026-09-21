import { Injectable } from '@nestjs/common';
import { createHash, timingSafeEqual } from 'node:crypto';

@Injectable()
export class TokenHashService {
  hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  compare(token: string, hashedToken: string): boolean {
    const tokenHash = this.hash(token);

    const tokenBuffer = Buffer.from(tokenHash, 'hex');
    const hashedTokenBuffer = Buffer.from(hashedToken, 'hex');

    if (tokenBuffer.length !== hashedTokenBuffer.length) {
      return false;
    }

    return timingSafeEqual(tokenBuffer, hashedTokenBuffer);
  }
}
