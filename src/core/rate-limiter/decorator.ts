import { SetMetadata } from '@nestjs/common';
import { RateLimiterModuleOptions } from './interface';

export const RateLimit = (options: RateLimiterModuleOptions): MethodDecorator => SetMetadata('rateLimit', options);
