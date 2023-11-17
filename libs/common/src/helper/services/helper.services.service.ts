import { Injectable } from '@nestjs/common';

@Injectable()
// export class HelperServicesService implements IHelperServicesService {
export class HelperServicesService {
  extractFields<T extends Record<string, any>, U extends Record<string, any>>(
    data: T,
    dto: U,
  ): T {
    const extractedFields: T = {} as T;

    for (const key in dto) {
      if (key in data) {
        extractedFields[key] = data[key];
      }
    }

    return extractedFields;
  }
}
