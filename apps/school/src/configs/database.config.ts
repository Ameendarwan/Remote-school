import { registerAs } from '@nestjs/config';

export default registerAs(
  'database',
  (): Record<string, any> => ({
    host:
      process.env?.DATABASE_HOST ??
      'mongodb://takmilmongo:ROkN4XdtUb4VIOHBvOXFetHERZkjYVKahRvdjKi9Rv3slstu7M4bQvUJnWcyvHRqMhu61u5PmNpCACDbx1Jd9A==@takmilmongo.mongo.cosmos.azure.com:10255',
    name: process.env?.DATABASE_NAME ?? 'takmil',
    debug: process.env.DATABASE_DEBUG === 'true',
    // options: process.env?.DATABASE_OPTIONS,
    options:
      process.env?.DATABASE_OPTIONS ??
      'ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@takmilmongo@',
  }),
);
