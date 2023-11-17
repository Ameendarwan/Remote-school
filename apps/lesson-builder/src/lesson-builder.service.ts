import { Injectable } from '@nestjs/common';

@Injectable()
export class LessonBuilderService {
  getHello(): string {
    return 'Hello World!';
  }
}
