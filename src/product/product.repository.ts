/* eslint-disable prettier/prettier */
import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { EntityManager, Repository } from 'typeorm';
import { OWN_TYPE } from 'src/enum/own-type.enum';
import { PRODUCT_TYPES } from 'src/enum/product-types.enum';
import { PRODUCT_STATUS } from 'src/enum/product-status.enum';
import { User } from 'src/user/entities/user.entity';
import { GetListProductDto } from './dto/get-list-product.dto';
import { isNullOrUndefined } from 'src/common/utils.comon';
import { ApproveDto } from './dto/approve.dto';

@CustomRepository(Product)
export class ProductRepository extends Repository<Product> {
  async createProduct(
    createProductDto: CreateProductDto,
    file: Express.Multer.File,
    transactionManager: EntityManager,
    user: User,
  ) {
    const product = transactionManager.create(Product, {
      userId: user.id,
      ownType: OWN_TYPE.SUPPLIER,
      quantity: 0,
      productType: PRODUCT_TYPES.PRODUCT,
      discount: Number(createProductDto.discount),
      name: createProductDto.name,
      categoryId: Number(createProductDto.categoryId),
      description: createProductDto.description,
      status: PRODUCT_STATUS.WAITING_APPROVE,
      price: Number(createProductDto.price),
      image: file.filename,
      createAt: new Date(),
      isDeleted: false,
    });

    await transactionManager.save(product);
    return {
      status: 200,
      message: 'Thêm sản phẩm thành công !!',
      data: null,
    };
  }

  async getListProduct(getListProductDto: GetListProductDto) {

    const limit = 10

    const query = this.createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .leftJoin('product.user', 'user')
      .select(['product', 'category', 'user'])
      .orderBy('product.name', 'ASC');
      query.take(limit).skip((getListProductDto.page - 1) * limit)
    if (!isNullOrUndefined(getListProductDto.supplierId)) {
      query
        .andWhere(`user.id = '${getListProductDto.supplierId}'`)
        .andWhere(`product.ownType = '${OWN_TYPE.SUPPLIER}'`)
        .andWhere(`product.productType = '${PRODUCT_TYPES.PRODUCT}'`);
    }

    if (!isNullOrUndefined(getListProductDto.categoryId)) {
      query.andWhere(`category.id = '${getListProductDto.categoryId}'`);
    }

    if (!isNullOrUndefined(getListProductDto.status)) {
      query.andWhere(`product.status = '${getListProductDto.status}'`);
    } else {
      query.andWhere(`product.status <> '${PRODUCT_STATUS.WAITING_APPROVE}'`);
    }

    const data = await query.getMany();
    const total = await query.getCount()
    const totalPage = []
    for(let i=0; i<Math.ceil(total/limit); i++){
      totalPage.push(i+1)
    }
    return {
      status: 200,
      message: ' lấy danh sách sản phẩm thành công !',
      data: data,
      pagination: { total: totalPage, offSet: getListProductDto.page }
    };
  }

  async getProductById(id: number) {
    const query = this.createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .leftJoin('product.user', 'user')
      .select(['product', 'category.name', 'user.name'])
      .orderBy('product.name', 'ASC')
      .where(`product.id = '${id}'`)
      .andWhere(`product.productType = '${PRODUCT_TYPES.PRODUCT}'`)
      .andWhere(`product.isDeleted = false`);
    const data = await query.getOne();
    return {
      status: 200,
      message: 'lấy thông tin sản phẩm thành công',
      data: data
    };
  }

  async approveProduct(approve: ApproveDto) {
    console.log(approve.id)
    await this
      .createQueryBuilder()
      .update(Product)
      .set({ status: PRODUCT_STATUS.ON_SALE })
      .where('id = :id', { id: approve.id })
      .execute();
    return {
        status: 200,
        message: 'Phê duyệt sản phẩm thành công',
        data: null
    }
  }
}
