/* eslint-disable prettier/prettier */
import { Repository } from "typeorm";
import { Category } from "./entities/category.entity";
import { CustomRepository } from "src/database/typeorm-ex.decorator";


@CustomRepository(Category)
export class CategoryRepository extends Repository<Category>
{

    async getAll(){
        const categories = await this.createQueryBuilder('category').getMany()
        return {
            status: 200,
            message: 'Lấy danh sách danh mục thành công !',
            data: categories
        }
    }
    
}