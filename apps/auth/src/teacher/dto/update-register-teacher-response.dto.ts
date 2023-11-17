import { AddressDoc, UserDoc } from '@app/common/entities/auth';
import { TeacherDoc } from '../repository/entities/teacher.entity';

export class UpdateRegisterTeacherResponseDto {
  user: UserDoc;
  address: AddressDoc;
  teacher: TeacherDoc;
}
