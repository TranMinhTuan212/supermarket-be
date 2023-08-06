/* eslint-disable prettier/prettier */

import { PRODUCT_STATUS } from "src/enum/product-status.enum"



export class GetListProductDto
{
    page?: number

    supplierId?: number

    categoryId?: number

    status?: number

    approve?: PRODUCT_STATUS.WAITING_APPROVE
}