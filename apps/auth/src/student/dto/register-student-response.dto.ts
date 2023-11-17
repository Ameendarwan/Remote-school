import { UserDoc, AddressDoc } from '@app/common/entities/auth';
import { TeacherDoc } from '../../teacher/repository/entities/teacher.entity';

export class RegisterStudentResponseDto {
  user: UserDoc;
  address: AddressDoc;
  teacher: TeacherDoc;
}
