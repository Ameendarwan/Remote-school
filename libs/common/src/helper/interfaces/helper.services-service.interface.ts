export interface IHelperServicesService {
  extractFieldsByDto<T, U>(
    data: T,
    dtoFactory: () => U,
  ): ExtractFieldsByDto<T, U>;
}

export type ExtractFieldsByDto<T, U> = {
  [K in keyof T]: K extends keyof U ? T[K] : never;
};
