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
import { MailModule } from './mail/mail.module';
import { SMTP } from './config/smtp.config';
import { UsersModule } from './users/users.module';
import { appConfig } from './config/app.config';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [
        databaseConfig,
        redisConfig,
        jwtConfig,
        cookieConfig,
        SMTP,
        appConfig,
      ],
      validationSchema: validateEnvConfig,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),

    ThrottlerModule.forRoot([
      {
        name: 'auth',
        ttl: 3 * 60 * 1000, //3 min
        limit: 15,
      },
      {
        name: 'global',
        ttl: 5 * 60 * 1000, //5 min
        limit: 50,
      },
    ]),

    RedisModule,
    HealthModule,
    AuthModule,
    MailModule,
    UsersModule,
    ProductModule,
    CartModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
