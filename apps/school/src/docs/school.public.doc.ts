import { applyDecorators, HttpStatus } from '@nestjs/common';
import { SchoolCreateDto } from '../dto/school-create.dto';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@app/common/doc/constants/doc.enum.constant';
import {
  Doc,
  DocRequest,
  DocResponse,
} from '@app/common/doc/decorators/doc.decorator';
import { SchoolDocParamsId } from '../constants/school.doc.constant';
import { SchoolGetSerialization } from '../serializations/school.get.serialization';
import { SchoolListSerialization } from '../serializations/school.list.serialization';
import { SchoolUpdateDto } from '../dto/school-update.dto';

export function SchoolCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: 'creates school along with organization and address',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: SchoolCreateDto,
    }),
    DocResponse('school.create', {
      httpStatus: HttpStatus.CREATED,
    }),
  );
}

export function SchoolGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary:
        'get detail of single school along with organization and address',
    }),
    DocRequest({
      params: SchoolDocParamsId,
    }),
    DocResponse<SchoolGetSerialization>('school.get', {
      serialization: SchoolGetSerialization,
    }),
  );
}

export function SchoolListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all of school and its detail of organization and address',
    }),
    DocResponse<SchoolListSerialization>('school.get', {
      serialization: SchoolListSerialization,
    }),
  );
}

export function SchoolUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update school along with organization and address',
    }),
    DocRequest({
      params: SchoolDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: SchoolUpdateDto,
    }),
    DocResponse<SchoolGetSerialization>('school.update', {
      serialization: SchoolGetSerialization,
    }),
  );
}

export function SchoolDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary:
        'deletes only school document from database, does not permanently deletes it',
    }),
    DocRequest({
      params: SchoolDocParamsId,
    }),
    DocResponse<SchoolGetSerialization>('school.delete'),
  );
}
