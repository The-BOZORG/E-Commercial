import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { GetMeProvider } from './providers/get-me.provider';
import { UpdateUserProvider } from './providers/update.provider';
import { GetUsersProvider } from './providers/get-all.provider';
import { AuthModule } from 'src/auth/auth.module';
import { UpdatePasswordProvider } from './providers/update-password.provider';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [UsersController],
  providers: [
    GetMeProvider,
    GetUsersProvider,
    UpdateUserProvider,
    UpdatePasswordProvider,
  ],
  exports: [TypeOrmModule],
})
export class UsersModule {}
