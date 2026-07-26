import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsDto } from './dto/get-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';






@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService
    ) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async createProduct(
        @Body() createProductDto: CreateProductDto,
        @Req() req: Request & {user: any},
    ) {
        return this.productsService.createProduct(
            createProductDto,
            req.user.id,
        )
    }


    @Get()
    async getAllProducts(
        @Query() query: GetProductsDto,
    ) {
        return this.productsService.getAllProducts(query)
    }


    @Get('slug/:slug')
    async getProductBySlug(
    @Param('slug') slug: string,
    ) {
    return this.productsService.getProductBySlug(slug);
    }

    @Get(':id')
    async getProductById(
    @Param('id') id: string,
    ) {
    return this.productsService.getProductById(id);
    }


    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: Request & { user: any },
    ) {
    return this.productsService.updateProduct(
    id,
    updateProductDto,
    req.user.id,
  );
}


    //delete product

    @Delete(":id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async deleteProduct(
    @Param("id") id: string,
    @Req() req: Request & { user: any },
    ) {
    return this.productsService.deleteProduct(
        id,
        req.user.id,
    );
}


    //restore product
    @Patch(":id/restore")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
async restoreProduct(
    @Param("id") id: string,
    @Req() req: Request & { user: any },
) {
    return this.productsService.restoreProduct(
        id,
        req.user.id,
    );
}


}
