import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { GetBrandsDto } from './dto/get-brand.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';



@Controller('brands')
export class BrandsController {
    constructor(
        private readonly brandService: BrandsService,
    ) {}

    // Create Brand
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createBrand(
    @Body() createBrandDto: CreateBrandDto,
    @Req() req: Request & { user: any },
  ) {
    return this.brandService.createBrand(
      createBrandDto,
      req.user.id,
    );
  }

  // Get All Brands
  @Get()
  async getAllBrands(
    @Query() query: GetBrandsDto,
  ) {
    return this.brandService.getAllBrands(query);
  }

  // Get Brand By Id
  @Get(':id')
  async getBrandById(
    @Param('id') id: string,
  ) {
    return this.brandService.getBrandById(id);
  }

  // Update Brand
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateBrand(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return this.brandService.updateBrand(
      id,
      updateBrandDto,
    );
  }

  // Soft Delete Brand
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deleteBrand(
    @Param('id') id: string,
  ) {
    return this.brandService.deleteBrand(id);
  }
}
