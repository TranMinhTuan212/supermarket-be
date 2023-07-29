/* eslint-disable prettier/prettier */
import { RolePermission } from "src/role-permission/entities/role-permission.entity";
import { UserRole } from "src/user-role/entities/user-role.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('public.role')
export class Role
{
    
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @OneToMany(()=>UserRole, userRole => userRole.role)
    userRoles: UserRole[]

    @OneToMany(()=>RolePermission, rolePermission => rolePermission.role)
    rolePermissions: RolePermission[]

}