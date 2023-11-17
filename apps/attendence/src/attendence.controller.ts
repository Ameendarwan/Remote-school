import { AttendenceService } from './attendence.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateAttendenceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { MarkAttendanceDto } from './dto/mark-attendence.dto';

@Controller('attendence')
export class AttendenceController {
  constructor(private readonly attendenceService: AttendenceService) {}

  @Post()
  create(@Body() createAttendenceDto: CreateAttendenceDto) {
    return this.attendenceService.create(createAttendenceDto);
  }

  @Post('mark-attendence')
  markAttendence(@Body() markAttendanceDto: MarkAttendanceDto) {
    return this.attendenceService.markAttendence(markAttendanceDto);
  }

  @Get()
  findAll() {
    return this.attendenceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendenceService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendenceService.update(id, updateAttendanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendenceService.softDelete(id);
  }
}
