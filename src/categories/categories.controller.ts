import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesDto } from './dto/get-categories.dto';




@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService,
    ) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async createCategory(
        @Body() createCategoryDto: CreateCategoryDto,
        @Req() req: Request & { user: any },
    ) {
        return this.categoriesService.createCategory(
            createCategoryDto,
            req.user.id
        )
    }


    @Get()
    async getAllCategories(
    @Query() query: GetCategoriesDto,
    )   {
        return this.categoriesService.getAllCategories(query);
    }

    @Get(":id")
    async getCategoryById(
        @Param("id") id: string,
    ) {
        return this.categoriesService.getCategoryById(id);
    }
}
