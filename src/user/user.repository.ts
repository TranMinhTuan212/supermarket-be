/* eslint-disable prettier/prettier */
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { ROLE } from 'src/enum/role.enum';
import { PasswordDto } from './dto/password.dto';
import * as bcrypt from 'bcrypt'

@CustomRepository(User)
export class UserRepository extends Repository<User> {

  async getAllSupllier(){
    const data = await this.createQueryBuilder('user')
                            .leftJoin('user.userRoles', 'userRole')
                            .leftJoin('userRole.role', 'role')
                            .select(['user.id', 'user.name'])
                            .where(`role.code = '${ROLE.SUPPLIER}'`)
                            .orderBy('user.name')
                            .getMany()
    return {
      status: 200,
      message: 'lấy danh sách nhà cung cấp thành công',
      data : data
    }
  }

  async getUserByEmail(email: string){
    const user = await this.createQueryBuilder('user')
                            .where(`user.email = '${email}'`)
                            .select(['user'])
                            .getOne()
    return user
  }

  async createUser(createUserDto: CreateUserDto, transactionManager: EntityManager){
    const user = transactionManager.create(User, {
      name: createUserDto.name,
      email: createUserDto.email.toLowerCase().trim(),
      phone: createUserDto.phone,
      password: createUserDto.password,
      createAt: new Date(),
      isDeleted: false
    })
    await transactionManager.save(user)
    return user
  }

  async changePassword(
    passwordDto: PasswordDto, 
    user: User,
    transactionManager: EntityManager
    ){

    // check password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    
    if(passwordDto.newPassword !== passwordDto.rePassword){
      return {
        status: 500,
        message: 'Nhập lại mật khẩu không đúng',
        data: null
      }
    }

    if(!await bcrypt.compare(passwordDto.password, user.password)){
      return {
        status: 500,
        message: 'Mật khẩu không đúng',
        data: null
      }
    }

    const hashPassword = bcrypt.hashSync(passwordDto.newPassword, salt)

    const id = user.id
    await transactionManager.update(User,
      { id },
      { password: hashPassword }
      )

    return {
      status: 200,
      message: 'Đổi mật khẩu thành công',
      data: null
    }

  }

}
