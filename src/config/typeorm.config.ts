import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getTypeOrmConfig(
  configService: ConfigService,
): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    host: configService.getOrThrow<string>('database.host'),
    port: configService.getOrThrow<number>('database.port'),
    username: configService.getOrThrow<string>('database.username'),
    password: configService.getOrThrow<string>('database.password'),
    database: configService.getOrThrow<string>('database.name'),
  };
}
