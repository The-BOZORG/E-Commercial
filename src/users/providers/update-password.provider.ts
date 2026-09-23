import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { UpdatePasswordDto } from '../dto/user-password.dto';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PasswordHashService } from 'src/auth/providers/password-hash.sprovider';

@Injectable()
export class UpdatePasswordProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordHashService: PasswordHashService,
  ) {}

  public async updatePassword(
    userId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword } = updatePasswordDto;

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await this.passwordHashService.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('Current password is incorrect');

    user.password = await this.passwordHashService.hash(newPassword);

    await this.userRepository.save(user);

    return {
      message: 'Password updated successfully',
    };
  }
}
