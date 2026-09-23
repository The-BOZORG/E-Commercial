import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { GetMeProvider } from './providers/get-me.provider';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [GetMeProvider],
  exports: [TypeOrmModule],
})
export class UsersModule {}
