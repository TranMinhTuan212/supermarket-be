/* eslint-disable prettier/prettier */

import { IsEmail, IsNotEmpty, IsString } from "class-validator"
import { ROLE } from "src/enum/role.enum"


export class CreateUserDto
{
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    phone: string

    @IsNotEmpty()
    @IsString()
    role: ROLE

    password: string


}
