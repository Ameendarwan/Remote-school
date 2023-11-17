import { ENUM_APP_ENVIRONMENT } from '@app/common';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    name: process.env.APP_NAME ?? 'ack',
    env: process.env.APP_ENV ?? ENUM_APP_ENVIRONMENT.DEVELOPMENT,

    repoVersion: '1',
    versioning: {
      enable: process.env.HTTP_VERSIONING_ENABLE === 'true' ?? false,
      prefix: 'v',
      version: process.env.HTTP_VERSION ?? '1',
    },

    globalPrefix: '/api',
    http: {
      enable: process.env.HTTP_ENABLE === 'true' ?? false,
      host: process.env.HTTP_HOST ?? 'localhost',
      port: process.env.HTTP_PORT
        ? Number.parseInt(process.env.HTTP_PORT)
        : 3000,
    },

    jobEnable: process.env.JOB_ENABLE === 'true' ?? false,
  }),
);
