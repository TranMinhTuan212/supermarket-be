/* eslint-disable prettier/prettier */
import { Repository } from "typeorm";
import { Role } from "./entities/role.entity";
import { CustomRepository } from "src/database/typeorm-ex.decorator";
import { ROLE } from "src/enum/role.enum";



@CustomRepository(Role)
export class RoleRepository extends Repository<Role>{

    

  async getRoleByCode(role: ROLE){
    const data = await this.createQueryBuilder('role')
                            .select('role')
                            .where(`role.code = '${role}'`)
                            .getOne()
    return data
  }
    
}