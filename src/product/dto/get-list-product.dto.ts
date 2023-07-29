/* eslint-disable prettier/prettier */

import { IsNotEmpty } from "class-validator"
import { PRODUCT_STATUS } from "src/enum/product-status.enum"



export class GetListProductDto
{
    
    @IsNotEmpty()
    page?: number

    supplierId?: number

    categoryId?: number

    status?: number

    approve?: PRODUCT_STATUS.WAITING_APPROVE
}