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
import { AddCartDto } from './dto/add- cart.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  // create product
  async createProduct(
    createProductDto: CreateProductDto,
    file: Express.Multer.File,
    transactionManager: EntityManager,
    user: User,
  ) {
    if (user['role'] !== ROLE.SUPPLIER) {
      return unlink(file.destination + '/' + file.filename, () => {
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

  // get list product
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

  // get product by id
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

  // approve product
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

  // add product to cart
  async addCart(user: User, addCartDto: AddCartDto){
    try {
      if (user['role'] !== ROLE.STORE) {
        throw new UnauthorizedException('Bạn không có quyền !');
      }
      return await this.productRepository.addCart(user, addCartDto)
    } catch (error) {
      return {
        status: 500,
        message: 'Thêm sản phẩm vào giỏ hàng thất bại',
        data: null
      }
    }
  }

  // get list product of cart
  async getCart(user: User, getListProductDto: GetListProductDto){
    try {
      if (user['role'] !== ROLE.STORE) {
        throw new UnauthorizedException('Bạn không có quyền !');
      }
      return await this.productRepository.getCart(user, getListProductDto)
    } catch (error) {
      return {
        status: 500,
        message: 'Lấy danh sách giỏi hàng thất bại',
        data: null
      }
    }
  }

  // delete cart
  async deleteCart(user: User, id: number){
    try {
      if (user['role'] !== ROLE.STORE) {
        throw new UnauthorizedException('Bạn không có quyền !');
      }
      return await this.productRepository.deleteCart(user, id)
    } catch (error) {
      return {
        status: 500,
        message: 'Xóa sản phẩm trong giỏi hàng thất bại',
        data: null
      }
    }
  }
}
