import { GradeGetSerialization } from './grade.get.serialization';

//TODO: response not appear in array form look into it
export class GradeListSerialization extends Array<GradeGetSerialization> {
  // @ApiProperty({
  //   required: true,
  //   nullable: false,
  //   description:
  //     'Object of all schools populated with organization and address',
  //   isArray: true,
  // })
  // data: SchoolGetSerialization[];
}
