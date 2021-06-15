import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, Validate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PasswordConfirmationValidator } from './password-confirmation.validator';
import { CurrentPasswordValidator } from './current-password.validator';
import { RequiredKeys } from '../../../core/validations/requiredKeys';
import { ColorValidator } from '../../../core/validations/color.validator';
import { Exist } from '../../../core/validations/exist';
import { Department } from '../../department/dto/department.entity';
import { IsValidDate } from '../../../core/validations/is-valid-date';

export class UpdateUserDto {
    @ApiProperty({
        required: false,
        minimum: 1,
        description: 'Avatar id of user.',
    })
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber({}, {
        message: 'avatarId must be a number',
    })
    @IsNotEmpty()
    @Min(1)
    avatarId: number;

    @ApiProperty({
        required: false,
        description: 'User\'s name',
    })
    @IsOptional()
    @IsString({
        message: 'Name is a string',
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        required: false,
        description: 'User\'s color. Hex only',
    })
    @IsOptional()
    @Validate(ColorValidator)
    @IsNotEmpty()
    color: string;

    @ApiProperty({
        required: false,
        description: 'New password',
    })
    @Validate(RequiredKeys, ['currentPassword', 'passwordConfirmation'])
    @IsOptional()
    @IsString({
        message: 'Password must be a string',
    })
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        required: false,
        description: 'Current password of user.',
    })
    @Validate(CurrentPasswordValidator)
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @ApiProperty({
        required: false,
        description: 'New password confirmation.',
    })
    @Validate(PasswordConfirmationValidator)
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    passwordConfirmation: string;

    @ApiProperty({
        required: false,
        description: 'Department Id',
    })
    @Exist(Department, {
        message: 'Department does not exist',
    })
    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    departmentId: number;

    @ApiProperty({
        required: false,
        description: 'User birthday',
    })
    @IsValidDate()
    @IsOptional()
    @IsNotEmpty()
    birthday: string;
}
