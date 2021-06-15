import { IsInt, Min, NotEquals } from 'class-validator';

export class ProjectMemberDto {
    @IsInt()
    @Min(1)
    memberId: number;

    @IsInt()
    @Min(1)
    roleId: number;
}
