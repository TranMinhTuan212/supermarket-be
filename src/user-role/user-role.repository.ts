/* eslint-disable prettier/prettier */
import { EntityManager, Repository } from "typeorm";
import { UserRole } from "./entities/user-role.entity";
import { CustomRepository } from "src/database/typeorm-ex.decorator";
import { CreateUserRoleDto } from "./dto/create.dto";


@CustomRepository(UserRole)
export class UserRoleRepository extends Repository<UserRole> {

    async createUserRole(createUserRole: CreateUserRoleDto, transactionManager: EntityManager){
        const userRole = await transactionManager.create(UserRole, {
            userId: createUserRole.userId,
            roleId: createUserRole.roleId
        })

        await transactionManager.save(userRole)

        return userRole
        
    }

}