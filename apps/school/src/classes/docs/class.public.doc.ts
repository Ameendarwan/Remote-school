import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@app/common/doc/constants/doc.enum.constant';
import {
  Doc,
  DocRequest,
  DocResponse,
} from '@app/common/doc/decorators/doc.decorator';
import { ClassGetSerialization } from '../serializations/class.get.serialization';
import { ClassListSerialization } from '../serializations/class.list.serialization';
import { ClassDocParamsId } from '../constants/class.doc.constant';
import { CreateClassesDto } from '../dto/create-class.dto';
import { UpdateClassesDto } from '../dto/update-class.dto';

export function ClassCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: 'creates class ',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: CreateClassesDto,
    }),
    DocResponse('class.create', {
      httpStatus: HttpStatus.CREATED,
    }),
  );
}

export function ClassGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail of single class ',
    }),
    DocRequest({
      params: ClassDocParamsId,
    }),
    DocResponse<ClassGetSerialization>('class.get', {
      serialization: ClassGetSerialization,
    }),
  );
}

export function ClassListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all of class ',
    }),
    DocResponse<ClassListSerialization>('class.get', {
      serialization: ClassListSerialization,
    }),
  );
}

export function ClassUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update class ',
    }),
    DocRequest({
      params: ClassDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: UpdateClassesDto,
    }),
    DocResponse<ClassGetSerialization>('class.update', {
      serialization: ClassGetSerialization,
    }),
  );
}

export function ClassDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary:
        'deletes only class document from database, does not permanently deletes it',
    }),
    DocRequest({
      params: ClassDocParamsId,
    }),
    DocResponse<ClassGetSerialization>('class.delete'),
  );
}
