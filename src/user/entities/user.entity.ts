/* eslint-disable prettier/prettier */
import { Order } from "src/order/entities/order.entity";
import { Product } from "src/product/entities/product.entity";
import { UserRole } from "src/user-role/entities/user-role.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('public.user')
export class User
{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    password: string

    @Column()
    email: string

    @Column()
    phone: string

    @Column()
    profileImage: string

    @Column()
    name: string

    @CreateDateColumn()
    createAt: Date

    @UpdateDateColumn()
    updateAt: Date;

    @Column()
    isDeleted: boolean;

    @OneToMany(()=>UserRole, userRole=>userRole.user)
    userRoles: UserRole[]

    @OneToMany(()=>Order, order => order.user)
    orders: Order[]

    @OneToMany(()=>Product, product=>product.user)
    products: Product

    @OneToMany(()=>Product, product=>product.user)
    product: Product

    // @OneToMany(()=>Notice, notice => notice.user)
    // notices: Notice[]

}