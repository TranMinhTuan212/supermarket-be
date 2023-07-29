/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from './role.repository';


@Injectable()
export class RoleService{

    constructor(
        @InjectRepository(RoleRepository)
        private roleRepository: RoleRepository
    ){}

    // async getRoleByCode(code: ROLE){
    //     return await this.roleRepository.getRoleByCode(code)
    // }
    
}