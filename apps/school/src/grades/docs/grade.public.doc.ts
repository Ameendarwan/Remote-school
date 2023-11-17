import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@app/common/doc/constants/doc.enum.constant';
import {
  Doc,
  DocRequest,
  DocResponse,
} from '@app/common/doc/decorators/doc.decorator';
import { GradeGetSerialization } from '../serializations/grade.get.serialization';
import { GradeListSerialization } from '../serializations/grade.list.serialization';
import { UpdateGradeDto } from '../dto/update-grade.dto';
import { CreateGradeDto } from '../dto/create-grade.dto';
import { GradeDocParamsId } from '../constants/grade.doc.constant';

export function GradeCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: 'creates grade ',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: CreateGradeDto,
    }),
    DocResponse('grade.create', {
      httpStatus: HttpStatus.CREATED,
    }),
  );
}

export function GradeGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail of single grade ',
    }),
    DocRequest({
      params: GradeDocParamsId,
    }),
    DocResponse<GradeGetSerialization>('grade.get', {
      serialization: GradeGetSerialization,
    }),
  );
}

export function GradeListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all of grade ',
    }),
    DocResponse<GradeListSerialization>('grade.get', {
      serialization: GradeListSerialization,
    }),
  );
}

export function GradeUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update grade ',
    }),
    DocRequest({
      params: GradeDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: UpdateGradeDto,
    }),
    DocResponse<GradeGetSerialization>('grade.update', {
      serialization: GradeGetSerialization,
    }),
  );
}

export function GradeDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary:
        'deletes only grade document from database, does not permanently deletes it',
    }),
    DocRequest({
      params: GradeDocParamsId,
    }),
    DocResponse<GradeGetSerialization>('grade.delete'),
  );
}
