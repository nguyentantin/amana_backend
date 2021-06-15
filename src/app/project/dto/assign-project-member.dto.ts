import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectMemberDto } from './project-member.dto';

export class AssignProjectMemberDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProjectMemberDto)
    members: ProjectMemberDto[];
}
