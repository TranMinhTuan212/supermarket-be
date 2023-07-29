/* eslint-disable prettier/prettier */

import { Controller, Get, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Auth } from "src/guards/auth.guard";


@Controller('category')
export class CategoryController
{

    constructor(
        private readonly categoryService: CategoryService
    ){}

    @Get('get-all-category')
    @ApiResponse({
        status: 500,
        description: 'Lấy danh sách category thất bại !!',
        type: null
    })
    @ApiResponse({
        status: 200,
        description: 'Lấy danh sách category thành công !!',
        type: null
    })
    @ApiOperation({
        summary: 'Lấy danh sách danh mục'
    })
    @UseGuards(Auth)
    @ApiBearerAuth()
    async getAll(){
        return await this.categoryService.getAll()
    }
    
}