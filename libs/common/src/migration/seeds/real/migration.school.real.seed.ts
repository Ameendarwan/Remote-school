import { Injectable } from '@nestjs/common';
import { SchoolCreateDto } from 'apps/school/src/dto/school-create.dto';
import { SchoolDoc } from 'apps/school/src/repository/entities/school.entity';
import { SchoolService } from 'apps/school/src/school.service';
import * as fs from 'fs';
import { Command } from 'nestjs-command';

@Injectable()
export class MigrationRealSchoolSeed {
  constructor(private readonly schoolService: SchoolService) {}

  generateFakeSchools() {
    const schools: Promise<SchoolDoc>[] = [];
    const jsonData = JSON.parse(
      fs.readFileSync(require.resolve('../data/schools.json'), 'utf8'),
    );

    for (let index = 0; index < jsonData.length; index++) {
      const data = jsonData[index];

      const schoolCreateDto: SchoolCreateDto = {
        name: data.name,
        status: data.status || 'old',
        offline: data.offline || 0,
        model: data.model || 'Private',
        started: new Date(),
        electricity: data.hasElectricity || 'no',
        internet: data.hasInternet || 'High-Speed',
        schoolType: data.hasElectricity || 'Primary',
        estimatedHousehold: data.estimatedHousehold || 1,
        spaceType: data.spaceType || 'Urban',
        nearestSchool: data.hasElectricity || 'Morgans Village',

        organization: data.organization,
        address: data.address,
        details: data.details || {},
      };

      const school: Promise<SchoolDoc> =
        this.schoolService.create(schoolCreateDto);
      schools.push(school);
    }

    return schools;
  }

  @Command({
    command: 'seed:real:school',
    describe: 'seeds school with provided sample data',
  })
  async seeds(): Promise<void> {
    try {
      const fakeSchools = this.generateFakeSchools();

      await Promise.all(fakeSchools);
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }

  @Command({
    command: 'remove:real:school',
    describe: 'remove schools',
  })
  async remove(): Promise<void> {
    try {
      await this.schoolService.softDeleteMany({});
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }
}
