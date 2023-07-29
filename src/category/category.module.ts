/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { TypeOrmExModule } from 'src/database/typeorm-ex.module';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';
import { UserRepository } from 'src/user/user.repository';

@Module({
    imports: [
        TypeOrmExModule.forCustomRepository([CategoryRepository, UserRepository])
    ],
    controllers: [CategoryController],
    providers: [CategoryService]
})
export class CategoryModule {}
