import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Brand, BrandDocument } from './schemas/brand.schema';
import { Model, Types } from 'mongoose';
import { CreateBrandDto } from './dto/create-brand.dto';
import slugify from 'slugify';
import { GetBrandsDto } from './dto/get-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';



@Injectable()
export class BrandsService {
    constructor(
        @InjectModel(Brand.name)
        private readonly brandModel: Model<BrandDocument>,
    ) {}

    private async findBrandName(name: string) {
        return await this.brandModel.findOne({ name });
    }

    async createBrand(createBrandDto: CreateBrandDto, userId: Types.ObjectId) {
        const { name, description, logo } = createBrandDto;

        const existingBrand = await this.findBrandName(name);

        if(existingBrand) {
            throw new BadRequestException("Brand already exists");
        }

        const slug = slugify(name, {
            lower: true,
            strict: true,
            trim: true
        });

        const brand = await this.brandModel.create({
            name,
            slug,
            description,
            logo,
            createdBy: userId,
        })

        return {
            success: true,
            message: "Brand created successfully",
            data: brand,
        }

    }


    //Get All Brands

    async getAllBrands(query: GetBrandsDto) {
        const {page, limit, search, sort} = query;

        const filter: any = {
            isActive: true,
        };

        if(search) {
            filter.name = {
                $regex: search,
                $options: "i",
            };
        }

        const skip = (page - 1) * limit;

        const brands =  await this.brandModel
        .find(filter)
        .sort(sort ? {[sort]: 1} : { createdAt: -1})
        .skip(skip)
        .limit(limit);

        const total = await this.brandModel.countDocuments(filter);

        return {
            success: true,
            message: "Brands fetched successfully",
            data: brands,
            pagination: {
                 total,
                 page,
                 limit,
                 totalPages: Math.ceil(total / limit),
            },
        }
    }

    //get brand by id

    async getBrandById(id: string) {
        if(!Types.ObjectId.isValid(id)) {
            throw new BadRequestException("Invalid brand ID");
        }

        const brand = await this.brandModel.findOne({
            _id: id,
            isActive: true,
        });

        if(!brand) {
            throw new NotFoundException("Brand not dound");
        }

        return {
            success: true,
            message: "Brand fetched successfully",
            data: brand
        }
    }

    //Update brand

    async updateBrand(id: string, updateBrandDto: UpdateBrandDto) {
        if(!Types.ObjectId.isValid(id)) {
            throw new BadRequestException("Invalid brand ID")
        }

        const brand = await this.brandModel.findById(id);

        if(!brand) {
            throw new NotFoundException("Brand not found");
        }

        if(updateBrandDto.name && updateBrandDto.name !== brand.name) {
            const existingBrand = await this.findBrandName(updateBrandDto.name);
            if(existingBrand) {
                throw new BadRequestException("Brand already exists");
            }

            brand.slug = slugify(updateBrandDto.name, {
                lower: true,
                strict: true,
                trim: true
            });
        }

        Object.assign(brand, updateBrandDto);

        await brand.save();

        return {
            success: true,
            message: "Brand update successfully",
            data: brand,
        }
    }


    //Delete Brand

    async deleteBrand(id: string) {
        if(!Types.ObjectId.isValid(id)) {
            throw new BadRequestException("Invalid brand ID");
        }

        const brand = await this.brandModel.findById(id);
        if(!brand) {
            throw new NotFoundException("Brand not found")
        }

        if(!brand.isActive) {
            throw new BadRequestException("Brand is already deleted");
        }

        brand.isActive = false;

        await brand.save();

        return {
            success: true,
            message: "Brand deleted successfully",
        }
    }


}
