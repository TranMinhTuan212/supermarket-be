/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInformation() {
    const env = process.env.NODE_ENV;
    return {
        statusCode: 200,
        message: `in ${env} deploy sprint 9+10`,
        data: null
    };
}
}
