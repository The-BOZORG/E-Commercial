import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetMeProvider } from './providers/get-me.provider';
import { JwtAuthGuard } from 'src/shared/guards/auth.guard';
import { Authorized } from 'src/shared/decorator/authorized.decorator';
import { UsersQueryDto } from './dto/users-query.dto';
import { GetUsersProvider } from './providers/get-all.provider';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserProvider } from './providers/update.provider';
import { UpdatePasswordDto } from './dto/user-password.dto';
import { UpdatePasswordProvider } from './providers/update-password.provider';
import { DeleteUserProvider } from './providers/delete.provider';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly getMeProvider: GetMeProvider,
    private readonly getUsersProvider: GetUsersProvider,
    private readonly updateUserProvider: UpdateUserProvider,
    private readonly updatePasswordProvider: UpdatePasswordProvider,
    private readonly deleteUserProvider: DeleteUserProvider,
  ) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  getMe(@Authorized('userId') userId: string) {
    return this.getMeProvider.execute(userId);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  getUsers(@Query() query: UsersQueryDto) {
    return this.getUsersProvider.getAll(query);
  }

  @Patch('update')
  @HttpCode(HttpStatus.OK)
  updateMe(
    @Authorized('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.updateUserProvider.updateUser(userId, updateUserDto);
  }

  @Patch('password')
  @HttpCode(HttpStatus.NO_CONTENT)
  updatePassword(
    @Authorized('userId') userId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    return this.updatePasswordProvider.updatePassword(
      userId,
      updatePasswordDto,
    );
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteMe(@Authorized('userId') userId: string): Promise<void> {
    return this.deleteUserProvider.delete(userId);
  }
}
