import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateWcUsernameDto {
    @ApiProperty({
        required: true,
        description: 'New work chat username',
    })
    @IsString()
    @IsNotEmpty()
    wcUsername: string;
}
