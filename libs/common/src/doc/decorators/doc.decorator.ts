import { ENUM_REQUEST_STATUS_CODE_ERROR } from '@app/common/request/constants/request.status-code.constant';
import { ResponseDefaultSerialization } from '@app/common/response/serializations/response.default.serialization';
import { faker } from '@faker-js/faker';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiHeaders,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '../constants/doc.enum.constant';
import {
  IDocDefaultOptions,
  IDocOfOptions,
  IDocOptions,
  IDocRequestOptions,
  IDocRequestFileOptions,
  IDocResponseOptions,
} from '../interfaces/doc.interface';
import { ENUM_ERROR_STATUS_CODE_ERROR } from '@app/common/error/constants/error.status-code.constant';

export function DocDefault<T>(options: IDocDefaultOptions): MethodDecorator {
  const docs = [];
  const schema: Record<string, any> = {
    allOf: [{ $ref: getSchemaPath(ResponseDefaultSerialization<T>) }],
    properties: {
      message: {
        example: options.messagePath,
      },
      statusCode: {
        type: 'number',
        example: options.statusCode,
      },
    },
  };

  if (options.serialization) {
    docs.push(ApiExtraModels(options.serialization));
    schema.properties = {
      ...schema.properties,
      data: {
        $ref: getSchemaPath(options.serialization),
      },
    };
  }

  return applyDecorators(
    ApiExtraModels(ResponseDefaultSerialization<T>),
    ApiResponse({
      status: options.httpStatus,
      schema,
    }),
    ...docs,
  );
}

export function DocOneOf<T>(
  httpStatus: HttpStatus,
  ...documents: IDocOfOptions[]
): MethodDecorator {
  const docs = [];
  const oneOf = [];

  for (const doc of documents) {
    const oneOfSchema: Record<string, any> = {
      allOf: [{ $ref: getSchemaPath(ResponseDefaultSerialization<T>) }],
      properties: {
        message: {
          example: doc.messagePath,
        },
        statusCode: {
          type: 'number',
          example: doc.statusCode ?? HttpStatus.OK,
        },
      },
    };

    if (doc.serialization) {
      docs.push(ApiExtraModels(doc.serialization));
      oneOfSchema.properties = {
        ...oneOfSchema.properties,
        data: {
          $ref: getSchemaPath(doc.serialization),
        },
      };
    }

    oneOf.push(oneOfSchema);
  }

  return applyDecorators(
    ApiExtraModels(ResponseDefaultSerialization<T>),
    ApiResponse({
      status: httpStatus,
      schema: {
        oneOf,
      },
    }),
    ...docs,
  );
}

export function DocAnyOf<T>(
  httpStatus: HttpStatus,
  ...documents: IDocOfOptions[]
): MethodDecorator {
  const docs = [];
  const anyOf = [];

  for (const doc of documents) {
    const anyOfSchema: Record<string, any> = {
      allOf: [{ $ref: getSchemaPath(ResponseDefaultSerialization<T>) }],
      properties: {
        message: {
          example: doc.messagePath,
        },
        statusCode: {
          type: 'number',
          example: doc.statusCode ?? HttpStatus.OK,
        },
      },
    };

    if (doc.serialization) {
      docs.push(ApiExtraModels(doc.serialization));
      anyOfSchema.properties = {
        ...anyOfSchema.properties,
        data: {
          $ref: getSchemaPath(doc.serialization),
        },
      };
    }

    anyOf.push(anyOfSchema);
  }

  return applyDecorators(
    ApiExtraModels(ResponseDefaultSerialization<T>),
    ApiResponse({
      status: httpStatus,
      schema: {
        anyOf,
      },
    }),
    ...docs,
  );
}

export function DocAllOf<T>(
  httpStatus: HttpStatus,
  ...documents: IDocOfOptions[]
): MethodDecorator {
  const docs = [];
  const allOf = [];

  for (const doc of documents) {
    const allOfSchema: Record<string, any> = {
      allOf: [{ $ref: getSchemaPath(ResponseDefaultSerialization<T>) }],
      properties: {
        message: {
          example: doc.messagePath,
        },
        statusCode: {
          type: 'number',
          example: doc.statusCode ?? HttpStatus.OK,
        },
      },
    };

    if (doc.serialization) {
      docs.push(ApiExtraModels(doc.serialization));
      allOfSchema.properties = {
        ...allOfSchema.properties,
        data: {
          $ref: getSchemaPath(doc.serialization),
        },
      };
    }

    allOf.push(allOfSchema);
  }

  return applyDecorators(
    ApiExtraModels(ResponseDefaultSerialization<T>),
    ApiResponse({
      status: httpStatus,
      schema: {
        allOf,
      },
    }),
    ...docs,
  );
}

export function Doc(options?: IDocOptions): MethodDecorator {
  const currentTimestamp: number = new Date().valueOf();
  const userAgent: string = faker.internet.userAgent();

  return applyDecorators(
    ApiOperation({
      summary: options?.summary,
      deprecated: options?.deprecated,
      description: options?.description,
      operationId: options?.operation,
    }),
    ApiHeaders([
      {
        name: 'user-agent',
        description: 'User agent header',
        required: false,
        schema: {
          default: userAgent,
          example: userAgent,
          type: 'string',
        },
      },
      {
        name: 'x-timestamp',
        description: 'Timestamp header, in microseconds',
        required: false,
        schema: {
          default: currentTimestamp,
          example: currentTimestamp,
          type: 'number',
        },
      },
    ]),
    DocDefault({
      httpStatus: HttpStatus.SERVICE_UNAVAILABLE,
      messagePath: 'http.serverError.serviceUnavailable',
      statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_SERVICE_UNAVAILABLE,
    }),
    DocDefault({
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      messagePath: 'http.serverError.internalServerError',
      statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
    }),
    DocDefault({
      httpStatus: HttpStatus.REQUEST_TIMEOUT,
      messagePath: 'http.serverError.requestTimeout',
      statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_REQUEST_TIMEOUT,
    }),
  );
}

export function DocRequest(options?: IDocRequestOptions) {
  const docs: Array<ClassDecorator | MethodDecorator> = [];

  if (options?.bodyType === ENUM_DOC_REQUEST_BODY_TYPE.FORM_DATA) {
    docs.push(ApiConsumes('multipart/form-data'));
  } else if (options?.bodyType === ENUM_DOC_REQUEST_BODY_TYPE.TEXT) {
    docs.push(ApiConsumes('text/plain'));
  } else if (options?.bodyType === ENUM_DOC_REQUEST_BODY_TYPE.JSON) {
    docs.push(ApiConsumes('application/json'));
  }

  if (options?.bodyType) {
    docs.push(
      DocDefault({
        httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        statusCode: ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR,
        messagePath: 'request.validation',
      }),
    );
  }

  if (options?.params) {
    const params: MethodDecorator[] = options?.params?.map((param) =>
      ApiParam(param),
    );
    docs.push(...params);
  }

  if (options?.queries) {
    const queries: MethodDecorator[] = options?.queries?.map((query) =>
      ApiQuery(query),
    );
    docs.push(...queries);
  }

  if (options?.body) {
    docs.push(ApiBody({ type: options?.body }));
  }

  return applyDecorators(...docs);
}

export function DocRequestFile(options?: IDocRequestFileOptions) {
  const docs: Array<ClassDecorator | MethodDecorator> = [];

  if (options?.params) {
    const params: MethodDecorator[] = options?.params.map((param) =>
      ApiParam(param),
    );
    docs.push(...params);
  }

  if (options?.queries) {
    const queries: MethodDecorator[] = options?.queries?.map((query) =>
      ApiQuery(query),
    );
    docs.push(...queries);
  }

  if (options?.body) {
    docs.push(ApiBody({ type: options?.body }));
  }

  return applyDecorators(ApiConsumes('multipart/form-data'), ...docs);
}

export function DocResponse<T = void>(
  messagePath: string,
  options?: IDocResponseOptions<T>,
): MethodDecorator {
  const docs: IDocDefaultOptions = {
    httpStatus: options?.httpStatus ?? HttpStatus.OK,
    messagePath,
    statusCode: options?.statusCode ?? options?.httpStatus ?? HttpStatus.OK,
  };

  if (options?.serialization) {
    docs.serialization = options?.serialization;
  }

  return applyDecorators(ApiProduces('application/json'), DocDefault(docs));
}

export function DocErrorGroup(docs: MethodDecorator[]) {
  return applyDecorators(...docs);
}
