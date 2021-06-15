import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Unique } from '../../../core/validations/unique';
import { BuildConfig } from './build-config.entity';

export class UpdateBuildConfigDto {
    @ApiProperty({
        description: 'Project Key',
        default: 'dev',
        required: true,
    })
    @IsNotEmpty({
        message: 'Project Key is required',
    })
    readonly projectKey: string;

    @ApiProperty({
        description: 'Team City Token',
        default: 'abcxxxxxx',
        required: true,
    })
    @IsNotEmpty({
        message: 'TeamCity token is required',
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
