import { SchoolGetSerialization } from './school.get.serialization';

//TODO: response not appear in array form look into it
export class SchoolListSerialization extends Array<SchoolGetSerialization> {
  // @ApiProperty({
  //   required: true,
  //   nullable: false,
  //   description:
  //     'Object of all schools populated with organization and address',
  //   isArray: true,
  // })
  // data: SchoolGetSerialization[];
}
