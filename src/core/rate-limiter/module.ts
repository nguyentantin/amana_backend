import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { RATE_LIMITER_OPTIONS } from './constants';
import { defaultRateLimiterOptions } from './default-options';
import { RateLimiterModuleAsyncOptions, RateLimiterModuleOptions, RateLimiterOptionsFactory } from './interface';

@Global()
@Module({
    exports: [RATE_LIMITER_OPTIONS],
    providers: [{
        provide: RATE_LIMITER_OPTIONS,
        useValue: defaultRateLimiterOptions,
    }],
})
export class RateLimiterModule {
    static register(options: RateLimiterModuleOptions = defaultRateLimiterOptions): DynamicModule {
        return {
            module: RateLimiterModule,
            providers: [{
                provide: RATE_LIMITER_OPTIONS,
                useValue: options,
            }],
        };
    }

    static registerAsync(options: RateLimiterModuleAsyncOptions): DynamicModule {
        return {
            module: RateLimiterModule,
            imports: options.imports,
            providers: [...this.createAsyncProviders(options), ...(options.extraProviders || [])],
        };
    }

    private static createAsyncProviders(options: RateLimiterModuleAsyncOptions): Provider[] {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }

        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass,
            },
        ];
    }

    private static createAsyncOptionsProvider(options: RateLimiterModuleAsyncOptions): Provider {
        if (options.useFactory) {
            return {
                provide: RATE_LIMITER_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }

        return {
            provide: RATE_LIMITER_OPTIONS,
            useFactory: async (optionsFactory: RateLimiterOptionsFactory) => optionsFactory.createRateLimiterOptions(),
            inject: [options.useExisting || options.useClass],
        };
    }
}
