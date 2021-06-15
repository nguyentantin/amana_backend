import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { NeolabEmailRegex } from '../../../core/constants/neolab-email-regex';
import { ApiProperty } from '@nestjs/swagger';

export class EmailConfirmationDto {
    @ApiProperty({
        description: 'Email',
        example: 'binh.nx@neo-lab.vn',
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
        message: 'Token is required',
    })
    @ApiProperty({
        description: 'token',
    })
    readonly token: string;
}
