import {
  IsBoolean,
  IsDate,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsUUID } from 'class-validator';

export class CreateAttendenceDto {
  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  subjectId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsBoolean()
  present?: boolean;

  @IsString()
  @IsNotEmpty()
  attendanceCode?: string;

  @IsOptional()
  @IsDate()
  attendanceDate?: Date;

  @IsLatitude()
  @IsNotEmpty()
  latitude?: number;

  @IsLongitude()
  @IsNotEmpty()
  longitude?: number;

  @IsOptional()
  details?: Record<string, any>;
}
