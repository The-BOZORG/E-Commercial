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

    RedisModule,
    HealthModule,
    AuthModule,
    MailModule,
    UsersModule,
    ProductModule,
    CartModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
