import { IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { Unique } from '../../../core/validations/unique';
import { User } from '../../../app/user/dto/user.entity';
import { NeolabEmailRegex } from '../../../core/constants/neolab-email-regex';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        description: 'Email',
        default: 'binh.nx@neo-lab.vn',
        required: true,
    })
    @IsEmail({}, {
        message: 'Email format is invalid',
    })
    @IsNotEmpty({
        message: 'Email is required',
    })
    @Unique(User, { message: 'Email is already use' })
    @Matches(NeolabEmailRegex, {
        message: 'Email must be belongs to Neo-lab',
    })
    email: string;

    @ApiProperty({
        description: 'User name',
        default: 'Nguyễn Xuân Bình',
        required: true,
    })
    @IsNotEmpty({
        message: 'User name is required',
    })
    name: string;

    @ApiProperty({
        description: 'User activation status',
        default: true,
        required: true,
    })
    @IsNotEmpty({
        message: 'User activation status is required',
    })
    isActive: boolean;

    @ApiProperty({
        description: 'Id of default avatar',
        default: 1,
        required: false,
    })
    @IsOptional()
    avatarId?: number;
}
