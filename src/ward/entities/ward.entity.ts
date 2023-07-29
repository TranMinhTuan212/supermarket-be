/* eslint-disable prettier/prettier */

import { Address } from "src/address/entities/address.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('public.ward')
export class Ward
{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @Column()
    district_id: number

    @OneToMany(()=>Address, address => address.ward)
    addresses: Address[]
}