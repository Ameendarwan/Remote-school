import { UserDoc, AddressDoc } from '@app/common/entities/auth';
import { TeacherDoc } from '../repository/entities/teacher.entity';

export class RegisterTeacherResponseDto {
  user: UserDoc;
  address: AddressDoc;
  teacher: TeacherDoc;
}
