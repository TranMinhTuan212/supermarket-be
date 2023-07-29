/* eslint-disable prettier/prettier */

import { Menu } from "src/menu/entities/menu.entity";
import { Permission } from "src/permission/entities/permission.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('public.menu_permission')
export class MenuPermission
{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    menu_id: number

    @Column()
    permissionId: number

    @ManyToOne(()=>Menu, menu => menu.menuPermissions)
    @JoinColumn({ name: 'menu_id', referencedColumnName: 'id' })
    menu: Menu

    @ManyToOne(()=>Permission, permission => permission.menuPermissions)
    @JoinColumn({ name: 'permission_id', referencedColumnName: 'id' })
    permission: Permission
}