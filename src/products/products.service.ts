import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from 'src/categories/schemas/category.schema';
import { Brand, BrandDocument } from 'src/brands/schemas/brand.schema';
import { CreateProductDto } from './dto/create-product.dto';
import slugify from 'slugify';
import { GetProductsDto } from './dto/get-products.dto';




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

    //Get all products

    async getAllProducts(query: GetProductsDto) {
        const {page, limit, search, category, brand, minPrice, maxPrice, isFeatured, isPublished, sort,} = query;

        const filter: any = {
            isActive: true,
        }

        //Search
        if(search) {
            filter.name = {
               $regex: search,
               $options: "i",
            };
        }

        //Category

        if(category) {
            filter.category = category;
        }


        //Brand
        if(brand) {
            filter.brand = brand;
        }

        //Feature
        if(isFeatured !== undefined) {
            filter.isFeatured = isFeatured;
        }

        //Published
        if(isPublished !== undefined) {
            filter.isPublished = isPublished;
        }

        //Price Filter
        if(minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};

            if(minPrice !== undefined) {
                filter.price.$gte = minPrice;
            }

            if(maxPrice !== undefined) {
                filter.price.$lte = maxPrice;
            }
        }

        const skip = (page - 1) * limit;

        let sortOption: any = {
            createdAt: -1,
        }

        if (sort) {
    switch (sort) {
      case 'price':
        sortOption = { price: 1 };
        break;

      case '-price':
        sortOption = { price: -1 };
        break;

      case 'name':
        sortOption = { name: 1 };
        break;

      case '-name':
        sortOption = { name: -1 };
        break;

      case 'oldest':
        sortOption = { createdAt: 1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }
  }

  const products = await this.productModel
    .find(filter)
    .populate('category', 'name slug')
    .populate('brand', 'name slug')
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  const total = await this.productModel.countDocuments(filter);

  return {
    success: true,
    message: 'Products fetched successfully',
    data: products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
    }
}
}
