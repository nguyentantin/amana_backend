import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { NeolabEmailRegex } from '../../../core/constants/neolab-email-regex';
import { ApiParam, ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        description: 'Email',
        example: 'abc@neo-lab.vn',
    })
    @IsEmail({}, {
        message: 'Email format is invalid',
    })
    @IsNotEmpty({
        message: 'Email is required',
    })
    @Matches(NeolabEmailRegex, {
        message: 'Email must be belongs to Neo lab',
    })
    readonly email: string;

    @IsNotEmpty({
        message: 'Password is required',
    })
    @ApiProperty({
        description: 'Password',
        example: 'abcd@123',
    })
    readonly password: string;
}
