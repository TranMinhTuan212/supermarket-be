/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsNumber } from "class-validator";



export class ApproveDto
{

    @IsNotEmpty()
    @IsNumber()
    id?: number
}