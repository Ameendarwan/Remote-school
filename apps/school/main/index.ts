import { createApp } from '../src/main.azure';
import { Context, HttpRequest } from '@azure/functions';
import { AzureHttpAdapter } from '@nestjs/azure-func-http';

export default function (context: Context, req: HttpRequest): void {
  AzureHttpAdapter.handle(createApp, context, req);
}
