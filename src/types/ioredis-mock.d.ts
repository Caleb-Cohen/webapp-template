declare module 'ioredis-mock' {
  import type Redis from 'ioredis';
  import type { RedisOptions } from 'ioredis';

  export default class RedisMock extends (Redis as {
    new (...args: unknown[]): Redis;
  }) {
    constructor(options?: string | RedisOptions);
  }
}
