import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { GetMeProvider } from './providers/get-me.provider';
import { JwtAuthGuard } from 'src/shared/guards/auth.guard';
import { Authorized } from 'src/shared/decorator/authorized.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly getMeProvider: GetMeProvider) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  getMe(@Authorized('userId') userId: string) {
    return this.getMeProvider.execute(userId);
  }
}
