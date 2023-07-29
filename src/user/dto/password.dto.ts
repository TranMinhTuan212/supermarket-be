/* eslint-disable prettier/prettier */

import { IsNotEmpty } from "class-validator";


export class PasswordDto
{
    @IsNotEmpty()
    password?: string

    @IsNotEmpty()
    newPassword?: string

    @IsNotEmpty()
    rePassword?: string
}