/* eslint-disable prettier/prettier */
import { Permission } from "src/permission/entities/permission.entity";
import { Role } from "src/role/entities/role.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('public.role_permission')
export class RolePermission 
{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    roleId: number

    @Column()
    permissionId: number

    @ManyToOne(()=>Role, role => role.rolePermissions)
    @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
    role: Role

    @ManyToOne(()=>Permission, permission => permission.rolePermissions)
    @JoinColumn({ name: 'permission_id', referencedColumnName: 'id' })
    permission: Permission

    
}