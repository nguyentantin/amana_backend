import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Unique } from '../../../core/validations/unique';

export class CreateUserDto {
    @ApiProperty({
        description: 'Name',
        default: 'Hieu',
        required: true,
    })
    @IsString({
        message: 'Name is required',
    })
    name: string;

    @ApiProperty({
        description: 'Email',
        default: 'binh@gmail.com',
        required: true,
    })
    @IsString({
        message: 'Email is required',
    })
    @IsEmail({}, {
        message: 'Email format is invalid',
    })
    @Unique('user', {message: 'Email is already use'})
    email: string;

    @ApiProperty({
        description: 'Password',
        default: '123123',
        required: true,
    })
    @IsString({
        message: 'Password is required',
    })
    password: string;

    @ApiProperty({
        description: 'Obniz ID',
        default: '3340-8873',
        required: true,
    })
    @IsString({
        message: 'Obniz ID is required',
    })
    obnizId: string;
}
