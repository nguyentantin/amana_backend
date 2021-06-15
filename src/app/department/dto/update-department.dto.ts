import { ApiProperty } from '@nestjs/swagger';
import { Department } from './department.entity';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UniqueIgnore } from '../../../core/validations/unique-ignore';

export class UpdateDepartmentDto {
    @ApiProperty({
        description: 'Department Name',
        required: true,
    })
    @UniqueIgnore(Department, {
        message: 'this name is already in used',
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name: string;

    @ApiProperty({
        description: 'Department description',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description: string;
}
