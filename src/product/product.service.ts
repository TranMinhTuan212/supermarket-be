/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductRepository } from './product.repository';
import { EntityManager } from 'typeorm';
import { unlink } from 'fs';
import { User } from 'src/user/entities/user.entity';
import { ROLE } from 'src/enum/role.enum';
import { GetListProductDto } from './dto/get-list-product.dto';
import { ApproveDto } from './dto/approve.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    file: Express.Multer.File,
    transactionManager: EntityManager,
    user: User,
  ) {
    if (user['role'] !== ROLE.SUPPLIER) {
      return unlink(file.destination + '/' + file.filename, (e) => {
        return {
          status: 500,
          message: 'Bạn không có quyền hạn để thực hiện thao tác này',
          data: null,
        };
      });
    }
    try {
      return await this.productRepository.createProduct(
        createProductDto,
        file,
        transactionManager,
        user,
      );
    } catch (e) {
      unlink(file.destination + '/' + file.filename, (e) => {
        return {
          staus: 500,
          message: 'Thêm sản phẩm không thành công !',
          data: e,
        };
      });
      return {
        staus: 500,
        message: 'Thêm sản phẩm không thành công !',
        data: e,
      };
    }
  }

  async getListProduct(getListProductDto: GetListProductDto) {
    try {
      return await this.productRepository.getListProduct(getListProductDto);
    } catch (error) {
      return {
        status: 500,
        message: 'lấy thông tin sản phẩm thất bại',
        data: null,
      };
    }
  }

  async getProductById(id: number) {
    try {
      return await this.productRepository.getProductById(id);
    } catch (error) {
      return {
        status: 500,
        message: 'lấy thông tin sản phẩm thất bại',
        data: null,
      };
    }
  }

  async approveProduct(user: User, approve: ApproveDto) {
    try {
      if (user['role'] !== ROLE.ADMIN) {
        throw new UnauthorizedException('Bạn không có quyền !');
      }
      return await this.productRepository.approveProduct(approve);
    } catch (error) {
      return {
        status: 500,
        message: 'Phê duyệt thất bại',
        data: null,
      };
    }
  }
}
