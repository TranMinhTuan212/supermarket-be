/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { ScheduleModule } from '@nestjs/schedule'
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { UserRoleModule } from './user-role/user-role.module';
import { PermissionModule } from './permission/permission.module';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { ProductModule } from './product/product.module';
import { AddressModule } from './address/address.module';
import { WardModule } from './ward/ward.module';
import { ProvinceModule } from './province/province.module';
import { DistrictModule } from './district/district.module';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';
import { NoticeModule } from './notice/notice.module';
import { MenuModule } from './menu/menu.module';
import { MenuPermissionModule } from './menu_permission/menu_permission.module';
import { SupplierStoreModule } from './supplier-store/supplier-store.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: +configService.get<number>('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [__dirname + '/**/*.entity.{js,ts}'],
          namingStrategy: new SnakeNamingStrategy(),
          synchronize: false,
        } as TypeOrmModuleOptions),
    }),
    UserModule,
    RoleModule,
    UserRoleModule,
    PermissionModule,
    RolePermissionModule,
    ProductModule,
    AddressModule,
    WardModule,
    ProvinceModule,
    DistrictModule,
    OrderModule,
    CategoryModule,
    NoticeModule,
    MenuModule,
    MenuPermissionModule,
    SupplierStoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
