import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { Category, CategorySchema } from 'src/categories/schemas/category.schema';
import { Brand, BrandSchema } from 'src/brands/schemas/brand.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema
      },
      {
        name: Category.name,
        schema: CategorySchema
      },
      {
        name: Brand.name,
        schema: BrandSchema
      }
    ])
  ],

  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [MongooseModule],
})
export class ProductsModule {}
