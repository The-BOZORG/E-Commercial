import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entity/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponse } from '../interface/users.interface';

@Injectable()
export class UpdateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: {
          email: updateUserDto.email,
        },
      });

      if (existingUser) throw new ConflictException('Email already exists');
    }

    Object.assign(user, updateUserDto);

    return this.userRepository.save(user);
  }
}
