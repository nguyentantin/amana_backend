import { IsNotEmpty } from 'class-validator';
import { EmailConfirmationDto } from './email-confirmation.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordConfirmationDto extends EmailConfirmationDto {
    @IsNotEmpty({
        message: 'Password is required',
    })
    @ApiProperty({
        description: 'Password',
    })
    readonly password: string;
}
