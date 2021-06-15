import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Department } from './department.entity';
import { Unique } from '../../../core/validations/unique';

export class CreateDepartmentDto {
    @ApiProperty({
        description: 'Department Name',
        required: true,
    })
    @Unique(Department, {
        message: 'this name is already in used',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Department description',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    description: string;
}
