/* eslint-disable prettier/prettier */
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/interface/jwt-payload.jwt';
import { EntityManager } from 'typeorm';
import { UserRoleRepository } from 'src/user-role/user-role.repository';
import { CreateUserRoleDto } from 'src/user-role/dto/create.dto';
import { RoleRepository } from 'src/role/role.repository';
import { ROLE } from 'src/enum/role.enum';
import { User } from './entities/user.entity';
import { PasswordDto } from './dto/password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepositoty: UserRepository,
    @InjectRepository(UserRoleRepository)
    private userRoleRepositoty: UserRoleRepository,
    @InjectRepository(RoleRepository)
    private roleRepositoty: RoleRepository,
    private jwtService: JwtService,
  ) {}

  async register(
    createUserDto: CreateUserDto,
    transactionManager: EntityManager,
    userAuth: User
  ) {
    if(userAuth['role'] !== ROLE.ADMIN){
      return {
          status: 500,
          message: 'Bạn không có quyền hạn để thực hiện thao tác này',
          data: null
      }
  }
    const { email, role } = createUserDto;

    // check email
    const user = await this.userRepositoty.getUserByEmail(email);
    if (user) {
      return {
        status: 500,
        message: 'email này đã được đăng ký, vui lòng sử dụng email khác',
        data: null,
      };
    }

    //  check role
    const checkRole = await this.roleRepositoty.getRoleByCode(role);
    if (!checkRole) {
      return {
        status: 500,
        message: 'vai trò người dùng không hợp lệ, vui lòng sử dụng email khác',
        data: null,
      };
    }

    //  create password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync('123456', salt);
    createUserDto.password = hashedPassword

    const newUser = await this.userRepositoty.createUser(
      createUserDto,
      transactionManager,
    );

    const createUserRoleDto = new CreateUserRoleDto();
    createUserRoleDto.roleId = checkRole.id;
    createUserRoleDto.userId = newUser.id;

    const userRole = await this.userRoleRepositoty.createUserRole(
      createUserRoleDto,
      transactionManager,
    );

    await transactionManager.save(userRole)

    return {
      status: 200,
      message: 'đăng ký thành công',
      data: newUser
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepositoty
      .createQueryBuilder('user')
      .leftJoin('user.userRoles', 'userRole')
      .leftJoin('userRole.role', 'role')
      .select(['user', 'userRole', 'role'])
      .where({ email: loginDto.email })
      .getOne();

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      return {
        status: 500,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng !',
        data: null,
      };
    }

    const payload: JwtPayload = {
      email: loginDto.email,
    };
    const accessToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    });
    const refreshToken = await this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '30d',
    });

    const userInfo = {
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      role: user.userRoles[0].role.code
    };
    return {
      status: 200,
      message: 'Đăng nhập thành công !',
      data: { accessToken, refreshToken, userInfo },
    };
  }

  async getAllSupplier() {
    try {
      return await this.userRepositoty.getAllSupllier();
    } catch (error) {
      return {
        status: 500,
        message: 'lấy danh sách nhà cung cấp thất bại',
        data: null,
      };
    }
  }

  async changePassword(
    passwordDto: PasswordDto, 
    user: User,
    transactionManager: EntityManager
  ){
    try {
      return await this.userRepositoty.changePassword(passwordDto, user, transactionManager)
    } catch (error) {
      return {
        status: 500,
        message: 'Có lỗi, thử lại sau',
        data: null
      }
    }
  }
}
