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
import { AddCartDto } from './dto/add- cart.dto';

@CustomRepository(Product)
export class ProductRepository extends Repository<Product> {
  // create product
  async createProduct(
    createProductDto: CreateProductDto,
    file: Express.Multer.File,
    transactionManager: EntityManager,
    user: User,
  ) {
    const product = await this.createQueryBuilder('product')
      .leftJoin('product.user', 'user')
      .where(`product.productType = '${PRODUCT_TYPES.PRODUCT}'`)
      .andWhere(`product.userId = '${user.id}'`)
      .andWhere(`product.barcode = '${createProductDto.barcode}'`)
      .getOne();
    if (product) {
      return {
        status: 500,
        message: 'Barcode này đã được sử dụng !',
        data: null,
      };
    }
    const newProduct = transactionManager.create(Product, {
      userId: user.id,
      barcode: createProductDto.barcode,
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

    await transactionManager.save(newProduct);
    return {
      status: 200,
      message: 'Thêm sản phẩm thành công !!',
      data: null,
    };
  }

  // get list product
  async getListProduct(getListProductDto: GetListProductDto) {
    const limit = 10;

    const query = this.createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .leftJoin('product.user', 'user')
      .leftJoin('user.userRoles', 'userRole')
      .leftJoin('userRole.role', 'role')
      .select(['product', 'category', 'user'])
      .orderBy('product.name', 'ASC');
    query
      .take(limit)
      .skip((getListProductDto.page - 1) * limit)
      .andWhere(`role.code = 'SUPPLIER'`);
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
    const total = await query.getCount();
    const totalPage = [];
    for (let i = 0; i < Math.ceil(total / limit); i++) {
      totalPage.push(i + 1);
    }
    return {
      status: 200,
      message: ' lấy danh sách sản phẩm thành công !',
      data: data,
      pagination: { total: totalPage, offSet: getListProductDto.page },
    };
  }

  // get product by id
  async getProductById(id: number) {
    const query = this.createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .leftJoin('product.user', 'user')
      .select(['product', 'category', 'user'])
      .orderBy('product.name', 'ASC')
      .where(`product.id = '${id}'`)
      .andWhere(`product.isDeleted = false`);
    const data = await query.getOne();
    return {
      status: 200,
      message: 'lấy thông tin sản phẩm thành công',
      data: data,
    };
  }

  // approve product
  async approveProduct(approve: ApproveDto) {
    console.log(approve.id);
    await this.createQueryBuilder()
      .update(Product)
      .set({ status: PRODUCT_STATUS.ON_SALE })
      .where('id = :id', { id: approve.id })
      .execute();
    return {
      status: 200,
      message: 'Phê duyệt sản phẩm thành công',
      data: null,
    };
  }

  // add product to cart
  async addCart(user: User, addCartDto: AddCartDto) {
    const product = await this.createQueryBuilder('product')
      .where(`product.productType = '${PRODUCT_TYPES.CART}'`)
      .andWhere(`product.userId = '${user.id}'`)
      .andWhere(`product.supplierId = '${addCartDto.supplierId}'`)
      .andWhere(`product.barcode = '${addCartDto.barcode}'`)
      .getOne();
    if (product) {
      await this.createQueryBuilder('product')
        .update()
        .set({ 
          quantity: product.quantity + addCartDto.quantity,
          price: product.price + addCartDto.price
         })
        .where(`product.id = '${product.id}'`)
        .execute();
      return {
        status: 200,
        message: 'Thêm vào giỏ hàng thành công !',
        data: null,
      };
    }

    await this.createQueryBuilder('product')
      .insert()
      .into(Product)
      .values([
        {
          ownType: OWN_TYPE.STORE,
          barcode: addCartDto.barcode,
          quantity: addCartDto.quantity,
          productType: PRODUCT_TYPES.CART,
          discount: addCartDto.discount,
          name: addCartDto.name,
          categoryId: addCartDto.categoryId,
          description: addCartDto.description,
          status: PRODUCT_STATUS.ON_SALE,
          price: addCartDto.price,
          createAt: new Date(),
          isDeleted: false,
          image: addCartDto.image,
          userId: user.id,
          supplierId: addCartDto.supplierId,
        },
      ])
      .execute();
    return {
      status: 200,
      message: 'Thêm vào giỏ hàng thành công !',
      data: null,
    };
  }

  // get list product of cart
  async getCart(user: User, getListProductDto: GetListProductDto) {
    const query = this.createQueryBuilder('product')
      .leftJoin('product.supplier', 'supplier')
      .leftJoin('product.category', 'category')
      .select(['product', 'supplier', 'category'])
      .where(`product.userId = '${user.id}'`)
      .andWhere(`product.ownType = '${OWN_TYPE.STORE}'`)
      .andWhere(`product.productType = '${PRODUCT_TYPES.CART}'`);

    if (!isNullOrUndefined(getListProductDto)) {
      if (!isNullOrUndefined(getListProductDto.supplierId)) {
        query.andWhere(`supplier.id = '${getListProductDto.supplierId}'`);
      }

      if (!isNullOrUndefined(getListProductDto.categoryId)) {
        query.andWhere(`category.id = '${getListProductDto.categoryId}'`);
      }
    }

    const data = await query.getMany();

    return {
      status: 200,
      message: 'Lấy danh sách giỏi hàng thành công',
      data: data,
    };
  }

  // delete product of cart
  async deleteCart(user: User, id: number) {
    await this.createQueryBuilder('product')
      .delete()
      .where(`product.id = '${id}'`)
      .execute();
    return {
      status: 200,
      message: 'Xóa sản phẩm trong giỏ hàng thành công',
      data: null,
    };
  }
}
