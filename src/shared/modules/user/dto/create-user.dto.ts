import { IsEmail, IsEnum, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { UserType } from '../../../types/index.js';
import { UserValidationMessage } from './user.messages.js';

export class CreateUserDto {
  @IsString({ message: UserValidationMessage.name.invalid })
  @Length(1, 15, { message: UserValidationMessage.name.length })
  public name!: string;

  @IsEmail({}, { message: UserValidationMessage.email.invalid })
  public email!: string;

  @IsOptional()
  @IsUrl({}, { message: UserValidationMessage.avatar.invalid })
  public avatar?: string;

  @IsEnum(UserType, { message: UserValidationMessage.type.invalid })
  public type!: UserType;

  @IsString({ message: UserValidationMessage.password.invalid })
  @Length(6, 12, { message: UserValidationMessage.password.length })
  public password!: string;
}
