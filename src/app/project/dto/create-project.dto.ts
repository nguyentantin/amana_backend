import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Unique } from '../../../core/validations/unique';
import { PlatFormType, Project } from './project.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
    @ApiProperty({
        description: 'Project Name',
        default: 'suco_ios',
        required: true,
    })
    @IsNotEmpty({
        message: 'Name is required',
    })
    @Unique(Project, { message: 'Name is already in used' })
    readonly name: string;

    @ApiProperty({
        description: 'Project description',
        default: 'sudo ios',
        required: true,
    })
    @IsNotEmpty({
        message: 'Description is required',
    })
    readonly description: string;

    @ApiProperty({
        description: 'Project platform type',
        default: 'ios',
        enum: PlatFormType,
        required: true,
    })
    @IsNotEmpty({
        message: 'Platform type is required',
    })
    @IsEnum(PlatFormType)
    readonly platformType: string;

    @ApiProperty({
        description: 's3Key',
        required: false,
    })
    readonly storageKey?: string;
}
