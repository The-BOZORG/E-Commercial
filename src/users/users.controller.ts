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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
import { Roles } from 'src/shared/decorator/role.decorator';
import { UserRole } from 'src/auth/enum/enum.auth';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Throttle({ auth: {} })
@ApiResponse({
  status: HttpStatus.TOO_MANY_REQUESTS,
  description: 'Rate limit: 15 requests per 3 minutes.',
})
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
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Current user information.',
  })
  getMe(@Authorized('userId') userId: string) {
    return this.getMeProvider.execute(userId);
  }

  @Get('all')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users with pagination (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Users list retrieved.' })
  getUsers(@Query() query: UsersQueryDto) {
    return this.getUsersProvider.getAll(query);
  }

  @Patch('update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully.',
  })
  updateMe(
    @Authorized('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.updateUserProvider.updateUser(userId, updateUserDto);
  }

  @Patch('password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update current user password' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Password updated successfully.',
  })
  updatePassword(
    @Authorized('userId') userId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.updatePasswordProvider.updatePassword(
      userId,
      updatePasswordDto,
    );
  }

  @Delete('delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete current authenticated user' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User deleted successfully.',
  })
  deleteMe(@Authorized('userId') userId: string): Promise<void> {
    return this.deleteUserProvider.delete(userId);
  }
}
