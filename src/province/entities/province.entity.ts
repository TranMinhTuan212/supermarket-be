/* eslint-disable prettier/prettier */

import { Address } from "src/address/entities/address.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('public.province')
export class Province
{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @OneToMany(()=>Address, address => address.province)
    addresses: Address[]
}