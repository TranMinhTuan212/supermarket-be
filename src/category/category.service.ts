/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryRepository } from "./category.repository";


@Injectable()
export class CategoryService
{
    constructor(
        @InjectRepository(CategoryRepository)
        private readonly categoryRepository: CategoryRepository
    ){}

    async getAll(){
        try{
            return await this.categoryRepository.getAll()
        }
        catch(e){
            return {
                status: 500,
                message: 'Lấy danh sách danh mục không thành công !!',
                data: e
            }
        }
    }
}