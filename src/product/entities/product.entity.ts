/* eslint-disable prettier/prettier */
import { Category } from 'src/category/entities/category.entity';
import { OWN_TYPE } from 'src/enum/own-type.enum';
import { PRODUCT_STATUS } from 'src/enum/product-status.enum';
import { PRODUCT_TYPES } from 'src/enum/product-types.enum';
import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('public.product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  ownType: OWN_TYPE;

  @Column()
  discount: number;

  @Column()
  quantity: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  status: PRODUCT_STATUS;

  @Column()
  productType: PRODUCT_TYPES;

  @Column()
  price: number;

  @Column()
  categoryId: number;

  @Column()
  image: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column()
  isDeleted: boolean;

  @OneToOne(() => Category)
  @JoinColumn()
  category: Category;

  @ManyToOne(() => User, user=>user.products)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(()=>Order, order=>order.products)
  order: Order
  
}
