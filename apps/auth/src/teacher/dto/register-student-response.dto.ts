import { UserDoc, AddressDoc } from '@app/common/entities/auth';
import { StudentDoc } from '../../student/repository/entities/student.entity';

export class RegisterStudentResponseDto {
  user: UserDoc;
  address: AddressDoc;
  student: StudentDoc;
}
