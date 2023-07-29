/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/version')
    @ApiOperation({ summary: 'Get Version Api Supermarket Service ' })
    getHello() {
        return this.appService.getInformation();
    }
  
}
