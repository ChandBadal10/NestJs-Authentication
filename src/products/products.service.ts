import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from 'src/categories/schemas/category.schema';
import { Brand, BrandDocument } from 'src/brands/schemas/brand.schema';
import { CreateProductDto } from './dto/create-product.dto';
import slugify from 'slugify';




@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name)
        private readonly productModel: Model<ProductDocument>,

        @InjectModel(Category.name)
        private readonly categoryModel: Model<CategoryDocument>,

        @InjectModel(Brand.name)
        private readonly brandModel: Model<BrandDocument>
    ) {}

    private async findCategory(id: string) {
        return this.categoryModel.findById(id);
    }

    private async findBrand(id: string) {
        return this.brandModel.findById(id);
    }

    private async findSku(sku: string) {
        return this.productModel.findOne({ sku })
    }


    async createProduct(createProductDto: CreateProductDto, userId: Types.ObjectId) {
        const  { name, description, price, discountPrice, stock, sku, category, brand, images, isFeatured, isPublished } = createProductDto;

        //Check Category
        const categoryExists = await this.findCategory(category);

        if(!categoryExists) {
            throw new NotFoundException("Category not found");
        }

        //check brand
        const brandExists = await this.findBrand(brand);

        if(!brandExists) {
            throw new NotFoundException("Brand not found");
        }

        // Check SKU

        const skuExists = await this.findSku(sku);

        if(skuExists) {
            throw new BadRequestException("SKU already exists");
        }

        // Validate Discount

        if(discountPrice && discountPrice > price) {
            throw new BadRequestException("Discount price cannot be greater than price");
        }

        // Generate slug
        const slug = slugify(name, {
            lower: true,
            strict: true,
            trim: true
        })


        // Create Product

        const product = await this.productModel.create({
            name,
            slug,
            description,
            price,
            discountPrice,
            stock,
            sku,
            category,
            brand,
            images: [],
            isFeatured,
            isPublished,
            createdBy: userId,
        });

        return {
            success: true,
            message: "Product created successfully",
            data: product
        }


    }
}
