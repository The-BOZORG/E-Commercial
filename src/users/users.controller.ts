import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetMeProvider } from './providers/get-me.provider';
import { JwtAuthGuard } from 'src/shared/guards/auth.guard';
import { Authorized } from 'src/shared/decorator/authorized.decorator';
import { UsersQueryDto } from './dto/users-query.dto';
import { GetUsersProvider } from './providers/get-all.provider';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly getMeProvider: GetMeProvider,
    private readonly getUsersProvider: GetUsersProvider,
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
}
