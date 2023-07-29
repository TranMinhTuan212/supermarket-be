/* eslint-disable prettier/prettier */

import { MenuPermission } from "src/menu_permission/entities/menu-permission.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('public.menu')
export class Menu
{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    code: string

    @Column()
    pageUrl: string

    @Column()
    parentId: number

    @Column()
    isParent: boolean

    @OneToMany(()=>MenuPermission, menuPermission => menuPermission.menu)
    menuPermissions: MenuPermission[]

}