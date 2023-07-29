/* eslint-disable prettier/prettier */

import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RoleService } from "./role.service";



@Controller('role')
@ApiTags('Role')
export class RoleController
{

    constructor(
        private roleService: RoleService
    ){}

    //  async getRoleByCode(code: ROLE){
    //     return await this.roleService.getRoleByCode(code)
    //  }   
}