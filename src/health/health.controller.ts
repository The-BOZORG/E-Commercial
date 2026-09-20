import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

import { RedisService } from 'src/redis/redis.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly database: TypeOrmHealthIndicator,
    private readonly redis: RedisService,
  ) {}

  @Get() //GET http://localhost:3000/api/v1/health
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.database.pingCheck('database'),

      async () => {
        const result = await this.redis.ping();

        if (result !== 'PONG') throw new Error('redis is not healthy');

        return {
          redis: {
            status: 'up',
          },
        };
      },
    ]);
  }
}
