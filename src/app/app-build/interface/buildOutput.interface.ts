export interface BuildOutputInterface {
    s3Key: string;
    version: string;
    filename: string;
    bundleId?: string;
    appName?: string;
}
