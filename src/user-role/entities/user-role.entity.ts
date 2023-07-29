/* eslint-disable prettier/prettier */
import { Role } from "src/role/entities/role.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('public.user_role')
export class UserRole
{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userId: number

    @Column()
    roleId: number

    @ManyToOne(()=>User, user=>user.userRoles)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User

    @ManyToOne(()=>Role, role=>role.userRoles)
    @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
    role: Role

}