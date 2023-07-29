/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateProductDto
{

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsNumber()
    price: string

    @IsNotEmpty()
    @IsNumber()
    discount: string

    @IsNotEmpty()
    file: object

    @IsNotEmpty()
    @IsNumber()
    categoryId: number

}