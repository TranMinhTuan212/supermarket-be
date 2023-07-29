/* eslint-disable prettier/prettier */
import { District } from "src/district/entities/district.entity";
import { Province } from "src/province/entities/province.entity";
import { Ward } from "src/ward/entities/ward.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('public.address')
export class Address
{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    province_id: number

    @Column()
    districtId: number

    @Column()
    wardId: number
    
    @OneToOne(()=>Province) @JoinColumn()
    province: Province

    @ManyToOne(()=>District, district => district.addresses)
    @JoinColumn({ name: 'district_id', referencedColumnName: 'id' })
    district: District

    @ManyToOne(()=>Ward, ward => ward.addresses)
    @JoinColumn({ name: 'ward_id', referencedColumnName: 'id' })
    ward: Ward

}