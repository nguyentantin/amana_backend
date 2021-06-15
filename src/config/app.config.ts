import {registerAs} from '@nestjs/config';

export default registerAs('app', () => ({
    host: process.env.APP_HOST || 'localhost',
    port: process.env.APP_PORT || 3001,
}));
