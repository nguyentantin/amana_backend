### Using Interceptor

Now you need to register the interceptor. You can do this only on some routes:

> app.controller.ts

```ts
import { RateLimiterInterceptor } from 'nestjs-rate-limiter';

@UseInterceptors(RateLimiterInterceptor)
@Get('/login')
public async login() {
    console.log('hello');
}
```

### Decorator

You can use the `@RateLimit` decorator to specify the points and duration for rate limiting on a per controller or per
route basis:

> app.controller.ts

```ts
import { RateLimit } from 'nestjs-rate-limiter';

@RateLimit({ points: 1, duration: 60 })
@Get('/signup')
public async signUp() {
    console.log('hello');
}
```

The above example would rate limit the `/signup` route to 1 request every 60 seconds.

Note that when passing in options via the decorator, it will combine the options for the module (defined via
`RateLimiterModule.register` or the default ones) along with the decorator options. While this should be fine for most
use cases, if you have defined a global interceptor with a `pointsConsumed` option, that will also apply to all
decorated requests. So if you need to have a different `pointsConsumed` for decorated requests than what you have
defined globally, you must pass it in when writing your decorator.

Also note that if the `keyPrefix` is already in use, it will not update any options, only reuse the existing rate
limiter object when it was last instantiated. This should be fine with the decorators, unless you manually specify a
duplicate `keyPrefix` or reuse the same class and method names with the decorator.

## Examples


### With Redis

First you must install either the `redis` or `ioredis` package:

```bash
npm install --save redis
```

```bash
npm install --save ioredis
```

Then you must create a client (offline queue must be turned off) and pass it via the `storeClient` config option to
`RateLimiterModule.register`:

> app.module.ts

```ts
import * as redis from 'redis';
const redisClient = redis.createClient({ enable_offline_queue: false });

import * as Redis from 'ioredis';
const redisClient = new Redis({ enableOfflineQueue: false });

@Module({
    imports: [
        RateLimiterModule.register({
            type: 'Redis',
            storeClient: redisClient,
        }),
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: RateLimiterInterceptor,
        },
    ],
})
export class ApplicationModule {}
```

### With Memcache

First you must install the `memcached` package:

```bash
npm install --save memcached
```

Then you must create a client and pass it via the `storeClient` config option to `RateLimiterModule.register`:

> app.module.ts

```ts
import * as Memcached from 'memcached';
const memcachedClient = new Memcached('127.0.0.1:11211');

@Module({
    imports: [
        RateLimiterModule.register({
            type: 'Memcached',
            storeClient: memcachedClient,
        }),
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: RateLimiterInterceptor,
        },
    ],
})
export class ApplicationModule {}
```

### With Postgres

First you must install the `pg` package:

```bash
npm install --save pg
```

Then you must create a client and pass it via the `storeClient` config option to `RateLimiterModule.register`:

> app.module.ts

```ts
import { Pool } from 'pg';
const postgresClient = new Pool({
    host: '127.0.0.1',
    port: 5432,
    database: 'root',
    user: 'root',
    password: 'secret',
});

@Module({
    imports: [
        RateLimiterModule.register({
            type: 'Postgres',
            storeClient: postgresClient,
            tableName: 'rate_limiting', // not specifying this will create one table for each keyPrefix
        }),
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: RateLimiterInterceptor,
        },
    ],
})
export class ApplicationModule {}
```

Note that this limiter also supports using [knex](https://knexjs.org/) or [sequelize](http://docs.sequelizejs.com/) with
an additional parameter as noted at
<https://github.com/animir/node-rate-limiter-flexible/wiki/PostgreSQL#sequelize-and-knex-support>.

### With MySQL

First you must install either the `mysql` or `mysql2` package:

```bash
npm install --save mysql
```

```bash
npm install --save mysql2
```

Then you must create a client and pass it via the `storeClient` config option to `RateLimiterModule.register`:

> app.module.ts

```ts
import * as mysql from 'mysql';

import * as mysql from 'mysql2';

const mysqlClient = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'secret',
});

@Module({
    imports: [
        RateLimiterModule.register({
            type: 'MySQL',
            storeClient: mysqlClient,
            dbName: 'ratelimits',
            tableName: 'rate_limiting', // not specifying this will create one table for each keyPrefix
        }),
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: RateLimiterInterceptor,
        },
    ],
})
export class ApplicationModule {}
```
