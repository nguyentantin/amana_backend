import { IsString } from 'class-validator';

export class RoleDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    guard: string;
}
