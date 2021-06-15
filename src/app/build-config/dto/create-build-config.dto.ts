import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Unique } from '../../../core/validations/unique';
import { BuildConfig } from './build-config.entity';

export class CreateBuildConfigDto {
    @ApiProperty({
        description: 'Project Key',
        default: 'dev',
        required: true,
    })
    @IsNotEmpty({
        message: 'Project Key is required',
    })
    @Unique(BuildConfig, { message: 'Project Key is already in used'})
    readonly projectKey: string;

    @ApiProperty({
        description: 'Team City Token',
        default: 'abcxxxxxx',
        required: true,
    })
    @IsNotEmpty({
        message: 'TeamCity Token is required',
    })
    readonly teamCityToken: string;

    @ApiProperty({
        description: 'Build env',
        default: 'dev',
        required: true,
    })
    @IsNotEmpty({
        message: 'Build env is required',
    })
    readonly env: string;
}
