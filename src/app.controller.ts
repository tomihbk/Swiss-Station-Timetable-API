import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Logger } from 'nestjs-pino'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly logger: Logger) { }

  @Get('test')
  getHello(): string {
    this.logger.log('inside gethello function')
    return this.appService.getHello();
  }

  @Get('ping')
  sendPing(): string{
    return "Pong"
  }
}