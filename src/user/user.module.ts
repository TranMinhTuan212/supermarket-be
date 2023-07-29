/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { TypeOrmExModule } from 'src/database/typeorm-ex.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserRoleRepository } from 'src/user-role/user-role.repository';
import { RoleRepository } from 'src/role/role.repository';

@Module({
    imports: [
    TypeOrmExModule.forCustomRepository([UserRepository, UserRoleRepository, RoleRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
        secret: `${process.env.JWT_SECRET}`,
        signOptions: {
            expiresIn: '1h'
        }
    }),
    ],
    controllers: [  UserController],
    providers: [UserService]
})
export class UserModule {}
