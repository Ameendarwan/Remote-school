import { SubjectGetSerialization } from './subject.get.serialization';

//TODO: response not appear in array form look into it
export class SubjectListSerialization extends Array<SubjectGetSerialization> {
  // @ApiProperty({
  //   required: true,
  //   nullable: false,
  //   description:
  //     'Object of all schools populated with organization and address',
  //   isArray: true,
  // })
  // data: SchoolGetSerialization[];
}
