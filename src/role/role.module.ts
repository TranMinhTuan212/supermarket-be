/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { TypeOrmExModule } from 'src/database/typeorm-ex.module';
import { RoleRepository } from './role.repository';

@Module({
    imports:[TypeOrmExModule.forCustomRepository([RoleRepository])],
    controllers:[RoleController],
    providers: [RoleService]
})
export class RoleModule {}
