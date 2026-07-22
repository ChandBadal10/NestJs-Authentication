import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Model, Types } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import slugify from 'slugify';
import { GetCategoriesDto } from './dto/get-categories.dto';



@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category.name)
        private readonly categoryModel: Model<CategoryDocument>,
    ) {}


    private async findCategoryByName(name: string) {
        return await this.categoryModel.findOne({
            name
        })
    }

    async createCategory(createCategoryDto: CreateCategoryDto, userId: Types.ObjectId) {
        const {name, description, image} = createCategoryDto;

        const existingCategory = await this.findCategoryByName(name);

        if(existingCategory) {
            throw new BadRequestException("Category already exists")
        }

        const slug = slugify(name, {
            lower: true,
            strict: true,
            trim: true
        });

        const category = await this.categoryModel.create({
            name, slug, description, image, createdBy: userId,
        });


        return {
            success : true,
            message: "Category created successfully",
            data: category,
        }
    }


    async getAllCategories(query: GetCategoriesDto) {
  const {
    page,
    limit,
    search,
    sort,
  } = query;

  const filter: any = {};

  if (search) {
    filter.name = {
      $regex: search,
      $options: 'i',
    };
  }

  const skip = (page - 1) * limit;

  const categories = await this.categoryModel
    .find(filter)
    .sort(sort ? { [sort]: 1 } : { createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total =
    await this.categoryModel.countDocuments(filter);

  return {
    success: true,
    message: 'Categories fetched successfully',
    data: categories,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}



  async getCategoryById(id: string) {
    if(!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid category id");
    }

    const category = await this.categoryModel.findById(id);

    if(!category) {
      throw new NotFoundException("Category not found");
    }

    return {
      success: true,
      message: "Category fetched successfully",
      data: category
    }
  }




}
