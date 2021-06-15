import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectAppBuildDetailDto {
    @ApiProperty({
        description: 'Project ID',
        default: 1,
        required: true,
    })
    @IsNotEmpty({
        message: 'Project id is required',
    })
    readonly id: string|number;

    @ApiProperty({
        description: 'AppBuild ID',
        default: 1,
        required: true,
    })
    @IsNotEmpty({
        message: 'AppBuild is required',
    })
    readonly appBuildId: string|number;

}
