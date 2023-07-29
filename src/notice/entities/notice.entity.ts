/* eslint-disable prettier/prettier */

import { NOTICE_STATUS } from "src/enum/notice-status.enum";
import { NOTICE_TYPES } from "src/enum/notice-types.enum";
import { Order } from "src/order/entities/order.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('public.notice')
export class Notice
{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: NOTICE_TYPES

    @Column()
    status: NOTICE_STATUS

    @Column()
    userId: number

    @Column()
    content: string

    @Column()
    orderId: number

    // @ManyToOne(()=>User, user => user.notices)
    // user: User

    // @ManyToOne(()=>Order, order => order.notices)
    // order: Order
    
}