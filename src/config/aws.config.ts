import { registerAs } from '@nestjs/config';

export default registerAs('aws', () => ({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucketName: process.env.AWS_BUCKET_NAME || 'amanastg',
    region: process.env.AWS_REGION || 'ap-southeast-1',
}));
