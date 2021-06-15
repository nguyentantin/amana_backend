export const defaultRateLimiterOptions = {
    /** Cached driver type, default is Ram memory */
    type: 'Memory',
    /** Maximum number of points can be consumed over durations */
    points: 5,
    /** Time in seconds */
    durations: 1,
    /** Point count per request */
    pointsConsumed: 1,
};
