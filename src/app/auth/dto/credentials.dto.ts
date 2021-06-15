import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CredentialsDto {
    @ApiProperty({
        description: 'Email',
        default: 'hieuheo@gmail.com',
        example: 'hieuheo@gmail.com',
    })
    @IsString({
        message: 'Email is required',
    })
    readonly email: string;

    @ApiProperty({
        description: 'Password',
        default: 'heohieu',
        example: 'heohieu',
    })
    @IsString({
        message: 'Password is required',
    })
    readonly password: string;
}
