import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import validateEnvConfig from './config/validate.env.config';
import { getTypeOrmConfig } from './config/typeorm.config';
import { RedisModule } from './redis/redis.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';

import { jwtConfig } from './config/jwt.config';
import { redisConfig } from './config/redis.config';
import { databaseConfig } from './config/database.config';
import { cookieConfig } from './config/cookie.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig, redisConfig, jwtConfig, cookieConfig],
      validationSchema: validateEnvConfig,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),

    RedisModule,
    HealthModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
