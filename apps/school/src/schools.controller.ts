import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { SchoolService } from './school.service';

import { SchoolCreateDto } from './dto/school-create.dto';
import { SchoolUpdateDto } from './dto/school-update.dto';

import { AddressService } from '@app/common/modules/address/address.service';
import { OrganizationService } from './organization/organization.service';
import {
  SchoolCreateDoc,
  SchoolDeleteDoc,
  SchoolGetDoc,
  SchoolListDoc,
  SchoolUpdateDoc,
} from './docs/school.public.doc';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('modules.public.school')
@Controller({
  version: '1',
  path: '/schools',
})
export class SchoolsController {
  constructor(
    private readonly schoolsService: SchoolService,
    private readonly addressService: AddressService,
    private readonly organizationService: OrganizationService,
  ) {}

  @SchoolCreateDoc()
  @Post()
  async create(@Body() createSchoolDto: SchoolCreateDto) {
    return this.schoolsService.create(createSchoolDto);
  }

  @SchoolListDoc()
  @Get()
  findAll() {
    return this.schoolsService.findAll();
  }

  @SchoolGetDoc()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const school = await this.schoolsService.findById(id);

    return { ...school.toObject() };
  }

  @SchoolUpdateDoc()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSchoolDto: SchoolUpdateDto,
  ) {
    return this.schoolsService.update(id, updateSchoolDto);
  }

  @SchoolDeleteDoc()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schoolsService.softDelete(id);
  }
}
