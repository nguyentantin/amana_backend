import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { NeolabEmailRegex } from '../../../core/constants/neolab-email-regex';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
    @IsEmail({}, {
        message: 'Email format is invalid',
    })
    @IsNotEmpty({
        message: 'Email is required',
    })
    @Matches(NeolabEmailRegex, {
        message: 'Email must be belongs to Neo lab',
    })
    @ApiProperty({
        description: 'Email',
        example: 'binh.nx@neo-lab.vn',
    })
    readonly email: string;
}
