import { ClassSubjectGetSerialization } from './class.subject.get.serialization';

//TODO: response not appear in array form look into it
export class ClassSubjectListSerialization extends Array<ClassSubjectGetSerialization> {
  // @ApiProperty({
  //   required: true,
  //   nullable: false,
  //   description:
  //     'Object of all schools populated with organization and address',
  //   isArray: true,
  // })
  // data: SchoolGetSerialization[];
}
