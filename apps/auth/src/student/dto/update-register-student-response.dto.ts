import { UserDoc, AddressDoc } from '@app/common/entities/auth';
import { StudentDoc } from '../repository/entities/student.entity';

export class UpdateRegisterStudentResponseDto {
  user: UserDoc;
  address: AddressDoc;
  student: StudentDoc;
}
