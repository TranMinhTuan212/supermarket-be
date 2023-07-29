/* eslint-disable prettier/prettier */
import { Product } from "src/product/entities/product.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('public.category')
export class Category
{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToOne(()=>Product, product => product.category)
    product: Product

}