import { IsEnum, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PlatFormType } from './project.entity';
import { ColorValidator } from '../../../core/validations/color.validator';

export class UpdateProjectDto {
    @ApiProperty({
        required: false,
        description: 'Project Name',
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        required: false,
        description: 'Project Description',
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        required: false,
        description: 'Project platform: android | ios | web',
    })
    @IsOptional()
    @IsNotEmpty()
    @IsEnum(PlatFormType)
    platformType: string;

    @ApiProperty({
        required: false,
        description: 'Project\'s color. Hex only',
    })
    @IsOptional()
    @Validate(ColorValidator)
    @IsNotEmpty()
    @IsString()
    color: string;

    @ApiProperty({
        required: false,
        description: 'S3 key',
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    s3Key: string;
}
