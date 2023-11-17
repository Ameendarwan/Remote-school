import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@app/common/doc/constants/doc.enum.constant';
import {
  Doc,
  DocRequest,
  DocResponse,
} from '@app/common/doc/decorators/doc.decorator';
import { ClassSubjectGetSerialization } from '../serializations/class.subject.get.serialization';
import { CreateClassSubjectsDto } from '../dto/create-class-subject.dto';
import { UpdateClassSubjectDto } from '../dto/update-class-subject.dto';
import { ClassSubjectDocParamsId } from '../constants/class.subject.doc.constant';
import { ClassSubjectListSerialization } from '../serializations/class.subject.list.serialization';

export function ClassSubjectCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: 'creates classSubject ',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: CreateClassSubjectsDto,
    }),
    DocResponse('classSubject.create', {
      httpStatus: HttpStatus.CREATED,
    }),
  );
}

export function ClassSubjectListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all of classSubject ',
    }),
    DocResponse<ClassSubjectListSerialization>('classSubject.get', {
      serialization: ClassSubjectListSerialization,
    }),
  );
}

export function ClassSubjectGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail of single classSubject ',
    }),
    DocRequest({
      params: ClassSubjectDocParamsId,
    }),
    DocResponse<ClassSubjectGetSerialization>('classSubject.get', {
      serialization: ClassSubjectGetSerialization,
    }),
  );
}

export function ClassSubjectUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update classSubject ',
    }),
    DocRequest({
      params: ClassSubjectDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: UpdateClassSubjectDto,
    }),
    DocResponse<ClassSubjectGetSerialization>('classSubject.update', {
      serialization: ClassSubjectGetSerialization,
    }),
  );
}

export function ClassSubjectDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary:
        'deletes only classSubject document from database, does not permanently deletes it',
    }),
    DocRequest({
      params: ClassSubjectDocParamsId,
    }),
    DocResponse<ClassSubjectGetSerialization>('classSubject.delete'),
  );
}
