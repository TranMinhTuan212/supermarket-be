/* eslint-disable prettier/prettier */

import { Column } from "typeorm";


export class SupplierStore
{
    @Column()
    id: number

    @Column()
    supplierId: number

    @Column()
    store_id: number
    
}