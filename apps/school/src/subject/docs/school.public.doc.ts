import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@app/common/doc/constants/doc.enum.constant';
import {
  Doc,
  DocRequest,
  DocResponse,
} from '@app/common/doc/decorators/doc.decorator';
import { SubjectDocParamsId } from '../constants/subject.doc.constant';
import { SubjectGetSerialization } from '../serializations/subject.get.serialization';
import { SubjectListSerialization } from '../serializations/subject.list.serialization';
import { UpdateSubjectDto } from '../dto/update-subject.dto';
import { CreateSubjectDto } from '../dto/create-subject.dto';

export function SubjectCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: 'creates subject ',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: CreateSubjectDto,
    }),
    DocResponse('subject.create', {
      httpStatus: HttpStatus.CREATED,
    }),
  );
}

export function SubjectGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail of single subject ',
    }),
    DocRequest({
      params: SubjectDocParamsId,
    }),
    DocResponse<SubjectGetSerialization>('subject.get', {
      serialization: SubjectGetSerialization,
    }),
  );
}

export function SubjectListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all of subject and its detail of organization and address',
    }),
    DocResponse<SubjectListSerialization>('subject.get', {
      serialization: SubjectListSerialization,
    }),
  );
}

export function SubjectUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update subject ',
    }),
    DocRequest({
      params: SubjectDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: UpdateSubjectDto,
    }),
    DocResponse<SubjectGetSerialization>('subject.update', {
      serialization: SubjectGetSerialization,
    }),
  );
}

export function SubjectDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary:
        'deletes only subject document from database, does not permanently deletes it',
    }),
    DocRequest({
      params: SubjectDocParamsId,
    }),
    DocResponse<SubjectGetSerialization>('subject.delete'),
  );
}
