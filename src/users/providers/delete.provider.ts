import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async delete(userId: string): Promise<void> {
    const result = await this.userRepository.delete({
      id: userId,
    });

    if (result.affected === 0) throw new NotFoundException('User not found');
  }
}
