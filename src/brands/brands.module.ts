import { Module } from '@nestjs/common';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { Brand, BrandSchema } from './schemas/brand.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[
    MongooseModule.forFeature([
    {
      name: Brand.name,
      schema: BrandSchema
    }
   ])
  ],
  controllers: [BrandsController],
  providers: [BrandsService],
  exports: [MongooseModule]
})
export class BrandsModule {}
