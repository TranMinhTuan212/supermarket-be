/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmExModule } from 'src/database/typeorm-ex.module';
import { ProductRepository } from './product.repository';
import { UserRepository } from 'src/user/user.repository';

@Module({
    imports: [
        TypeOrmExModule.forCustomRepository([ProductRepository, UserRepository])
    ],
    controllers: [ ProductController ],
    providers: [ProductService]
})
export class ProductModule {}
