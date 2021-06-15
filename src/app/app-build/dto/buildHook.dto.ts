export class BuildHookDto {
    buildResult: string;
    buildId: number;
    buildName: string;
    projectName: string;
    buildTypeId: string;
    projectId: string;
    changes: object[];
    buildNumber: number;
    teamcityProperties: object[];
}
