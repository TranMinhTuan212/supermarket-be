/* eslint-disable prettier/prettier */
import { Body, Post, UseInterceptors, UploadedFile, Get, Param, UseGuards, Query, Put, ValidationPipe, Delete } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Connection } from 'typeorm';
import { Product } from './entities/product.entity';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { GetListProductDto } from './dto/get-list-product.dto';
import { Auth } from 'src/guards/auth.guard';
import { ApproveDto } from './dto/approve.dto';
import { AddCartDto } from './dto/add- cart.dto';

@Controller('/product')
@ApiTags('Product')
export class ProductController {
  constructor(
    private productService: ProductService,
    private readonly connection: Connection
    ) {}

    // create product
  @Post('create-product')
  @ApiResponse({
    status: 500,
    description: 'Thêm sản phẩm không thành công !!',
  })
  @ApiResponse({
    status: 200,
    description: 'Thêm sản phẩm thành công !!',
  })
  @ApiOperation({
    summary: 'Thêm sản phẩm',
  })
  @UseGuards(Auth)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/images',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtension = extname(file.originalname);
          callback(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
        },
      }),
    }),
  )
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User
  ) {
    return await this.connection.transaction(async (transactionManager)=>{
      return await this.productService.createProduct(createProductDto, file, transactionManager, user);
    })
  }

  // get list product
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách sản phẩm thành công !',
    type: Product
  })
  @ApiResponse({
    status: 500,
    description: 'Lấy danh sách sản phẩm không thành công !',
    type: null
  })
  @ApiOperation({
    summary: 'Lấy danh sách sản phẩm'
  })
  @UseGuards(Auth)
  @ApiBearerAuth()
  async getListProduct(
    @Query() getListProductDto: GetListProductDto
  ){
    return await this.productService.getListProduct(getListProductDto)
  }

  // get product by id
  @Get('detail/:id')
  @ApiResponse({
    status: 200,
    description: 'lây thông tin sản phẩm thành công',
    type: Product
  })
  @ApiResponse({
    status: 500,
    description: 'lây thông tin sản phẩm thất bại',
    type: null
  })
  @ApiOperation({
    summary: 'Lấy thông tin sản phẩm theo id'
  })
  @UseGuards(Auth)
  @ApiBearerAuth()
  async getProductBy(@Param('id') id: number){
      return await this.productService.getProductById(id)
  }

    // approve product
  @Put('approve-product')
  @ApiResponse({
    status: 200,
    description: 'Phê duyệt sản phẩm thành công',
    type: null
  })
  @ApiResponse({
    status: 200,
    description: 'Phê duyệt sản phẩm thất bại',
    type: null
  })
  @UseGuards(Auth)
  @ApiBearerAuth()
  async approveProduct(
    @GetUser() user: User,
    @Body(ValidationPipe) approveDto: ApproveDto
  ){
      return await this.productService.approveProduct(user, approveDto)
  }

  // add product to cart
  @Post('add-cart')
  @ApiResponse({
    status: 200,
    description: 'Thêm sản phẩm vào giỏ hàng thành công'
  })
  @ApiResponse({
    status: 500,
    description: 'Thêm sản phẩm vào giỏ hàng thất bại'
  })
  @UseGuards(Auth)
  @ApiBearerAuth()
  async addCart(@GetUser() user: User, @Body(ValidationPipe) addCartDto: AddCartDto){
    return await this.productService.addCart(user, addCartDto)
  }

  // get list product of cart
  @Get('get-cart')
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách giỏ hàng thành công'
  })
  @ApiResponse({
    status: 500,
    description: 'Lấy danh sách giỏ hàng thất bại'
  })
  @UseGuards(Auth)
  @ApiBearerAuth()
  async getCart(@GetUser() user: User, @Query() getListProductDto: GetListProductDto){
    return await this.productService.getCart(user, getListProductDto)
  }

  // delete product of cart
  @Delete('delete-cart/:id')
  @ApiResponse({
    status: 200,
    description: 'Xóa sản phẩm trong giỏ hàng thành công'
  })
  @ApiResponse({
    status: 500,
    description: 'Xóa sản phẩm trong giỏ hàng thất bại'
  })
  @UseGuards(Auth)
  @ApiBearerAuth()
  async deleteCart(@GetUser() user : User, @Param('id') id: number){
    return await this.productService.deleteCart(user, id)
  }

}
