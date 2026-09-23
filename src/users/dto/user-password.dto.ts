import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  currentPassword: string;

  @IsString()
  @MinLength(4)
  @MaxLength(100)
  newPassword: string;
}
