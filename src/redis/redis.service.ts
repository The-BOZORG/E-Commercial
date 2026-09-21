import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client: RedisClientType;

  constructor(private readonly configService: ConfigService) {
    this.client = createClient({
      url: this.configService.getOrThrow<string>('redis.url'),
    });

    this.client.on('error', (error) => {
      console.error('Redis Client Error:', error);
    });
  }

  async onModuleInit(): Promise<void> {
    await this.client.connect();

    console.log('Redis connected successfully');
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }

  getClient(): RedisClientType {
    return this.client;
  }

  async ping(): Promise<string> {
    return this.client.ping();
  }
}
