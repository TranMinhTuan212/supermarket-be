/* eslint-disable prettier/prettier */
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Post, Body, ValidationPipe, Get, UseGuards, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login-user.dto';
import { Connection } from 'typeorm';
import { Auth } from 'src/guards/auth.guard';
import { GetUser } from './get-user.decorator';
import { PasswordDto } from './dto/password.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(
    private userService: UserService,
    private connection: Connection,
  ) {}

  @Post('register')
  @ApiResponse({
    status: 500,
    description: 'Đăng ký thất bại',
    type: null,
  })
  @ApiResponse({
    status: 200,
    description: 'Đăng Ký thành công !!',
    type: null,
  })
  @ApiOperation({
    summary: 'Đăng ký tài khoản người dùng',
  })
  @UseGuards(Auth)
  @ApiBearerAuth()
  async register(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @GetUser() user: User
    ) {
    return await this.connection.transaction((transactionManager)=>{
      return this.userService.register(createUserDto, transactionManager, user);
    })
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'đăng nhập thành công !!',
    type: null,
  })
  @ApiResponse({
    status: 500,
    description: 'Tên tài khoản hoặc mật khẩu không đúng !!',
    type: null,
  })
  @ApiOperation({
    summary: 'Đăng nhập user',
  })
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    try {
      return await this.userService.login(loginDto);
    } catch (e) {
      return {
        status: 500,
        message: 'Có lỗi xảy ra, vui lòng thử lại',
        data: null,
      };
    }
  }

  @Get('get-all-supplier')
  @ApiResponse({
    status: 200,
    description: 'lấy danh sách nhà cung cấp thành công',
    type: User,
  })
  @ApiResponse({
    status: 500,
    description: 'lấy danh sách nhà cung cấp thất bại',
    type: null,
  })
  @ApiOperation({
    summary: 'lấy danh sách nhà cung cấp',
  })
  @UseGuards(Auth)
  @ApiBearerAuth()
  async getAllSupplier() {
    return this.userService.getAllSupplier();
  }

  @Put('change-password')
  @ApiResponse({
    status: 200,
    description: 'Đổi mật khẩu thành công',
    type: null
  })
  @ApiResponse({
    status: 500,
    description: 'Đổi mật khẩu thất bại',
    type: null
  })
  @UseGuards(Auth)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Đổi mật khẩu'
  })
  async changePassword(
    @Body(ValidationPipe) passwordDto: PasswordDto,
    @GetUser() user: User
    ){
      return await this.connection.transaction((transactionManager)=>{
        return this.userService.changePassword(passwordDto, user, transactionManager)
      })
  }
}
