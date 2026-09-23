import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { GetMeProvider } from './providers/get-me.provider';
import { UpdateUserProvider } from './providers/update.provider';
import { GetUsersProvider } from './providers/get-all.provider';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [GetMeProvider, GetUsersProvider, UpdateUserProvider],
  exports: [TypeOrmModule],
})
export class UsersModule {}
