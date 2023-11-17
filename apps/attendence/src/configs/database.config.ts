import { registerAs } from '@nestjs/config';

export default registerAs(
  'database',
  (): Record<string, any> => ({
    host: process.env?.DATABASE_HOST ?? 'mongodb://mongo1:27017',
    name: process.env?.DATABASE_NAME ?? 'takmil',
    debug: process.env.DATABASE_DEBUG === 'true',
    options: process.env?.DATABASE_OPTIONS ?? 'retryWrites=false&w=majority',
  }),
);
