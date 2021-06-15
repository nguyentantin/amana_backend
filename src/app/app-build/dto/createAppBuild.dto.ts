export class CreateAppBuildDto {
    buildNumber: number;
    commitChanges: string;
    version: string;
    projectId: number;
    s3Key: string;
    bundleId?: string;
    appName?: string;
    filename?: string;
    env?: number;
}
