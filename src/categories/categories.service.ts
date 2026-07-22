import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Model, Types } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import slugify from 'slugify';



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


}
