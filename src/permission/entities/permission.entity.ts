/* eslint-disable prettier/prettier */
import { MenuPermission } from "src/menu_permission/entities/menu-permission.entity";
import { RolePermission } from "src/role-permission/entities/role-permission.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('public.permission')
export class Permission
{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    groupName: string

    @OneToMany(()=>MenuPermission, menuPermission => menuPermission.permission)
    menuPermissions: MenuPermission[]

    @OneToMany(()=>RolePermission, rolePermission => rolePermission.permission)
    rolePermissions: RolePermission[]

}