import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export async function getTypeOrmConfig(
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> {
  return {
    type: 'mysql',
    host: configService.getOrThrow<string>('database.host'),
    port: configService.getOrThrow<number>('database.port'),
    username: configService.getOrThrow<string>('database.user'),
    password: configService.getOrThrow<string>('database.password'),
    database: configService.getOrThrow<string>('database.name'),
  };
}
