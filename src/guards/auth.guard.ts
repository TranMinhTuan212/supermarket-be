/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from 'src/user/user.repository';

export class Auth implements CanActivate {
  constructor(
    @InjectRepository(UserRepository)
    private userRepositoty: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    if (!request.headers.authorization) {
      throw new UnauthorizedException(
        'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
      );
    }
    request.token = await this.validateToken(request.headers.authorization);

    let active = false;
    const query = this.userRepositoty.createQueryBuilder('user');
    query
      .select(['user', 'userRole', 'role'])
      .leftJoin('user.userRoles', 'userRole')
      .leftJoin('userRole.role', 'role')
      .where('user.email = :email', { email: request.token['email'] })
      .andWhere('user.isDeleted = false')

    const user = await query.getOne();
    if (user) {
        const role = user.userRoles[0].role.code;
        user['role'] = role;
        request.user = user;
        active = true;
    } else {
        throw new UnauthorizedException(
            'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!'
        );
    }

    return active;
  }

  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }
    const token = auth.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException(
        'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!',
      );
    }
  }
}
