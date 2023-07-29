/* eslint-disable prettier/prettier */
import { Address } from "src/address/entities/address.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('public.district')
export class District
{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    name: string

    @Column()
    provinceId: number

    @OneToMany(()=>Address, address => address.district)
    addresses: Address[]

}