import { Controller, Get, UseGuards } from "@nestjs/common";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/role.enum";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";



@Controller("admin")

export class AdminController {
    @Get("dashboard")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    dashboard() {
        return {
            success: true,
            message: "Welcome Admin",
        };
    }
}