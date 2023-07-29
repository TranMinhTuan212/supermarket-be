/* eslint-disable prettier/prettier */

import { ORDER_STATUS } from "src/enum/order-status.enum";
import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('public.order')
export class Order
{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userId: number

    @Column()
    status: ORDER_STATUS

    @Column()
    total: number

    @Column()
    detail: string

    @CreateDateColumn()
    createAt: Date

    @UpdateDateColumn()
    updateAt: Date

    @Column()
    deleteAt: Date

    @Column()
    isDeleted: boolean

    @Column()
    approvedAt: Date

    @Column()
    cancelledAt: Date

    @Column()
    isUserCancel: boolean

    @Column()
    cancelReason: string

    @ManyToOne(()=>User, user => user.orders)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User

    @OneToMany(()=>Product, product => product.order)
    products: Product[]

    // @OneToMany(()=>Notice, notice => notice.order)
    // notices: Notice[]

}