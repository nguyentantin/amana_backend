import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { NeolabEmailRegex } from '../../../core/constants/neolab-email-regex';

export class VerifyUserDto {
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
    readonly token: string;
}
