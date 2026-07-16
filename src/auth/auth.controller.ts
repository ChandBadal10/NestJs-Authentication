import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import type { Response } from "express";
import { EmailDto } from "./dto/email.dto";




@Controller("auth")

export class AuthController {

    constructor (
        private readonly authService: AuthService,
    ) {}

    @Post("register")
    register(
        @Body() registerDto: RegisterDto,
    ) {
        return this.authService.register(registerDto)
    }

    @Post("login")
    login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) response : Response,
    ) {
        return this.authService.login(loginDto, response)
    }

    @Get("profile")
    @UseGuards(JwtAuthGuard)
    profile(@Req() req: any) {
        return {
            success: true,
            user: req.user,
        }
    }

    @Post("logout")
    logout(
        @Res({passthrough: true}) response: Response,
    ) {
        return this.authService.logout(response)
    }


    @Post("send-verify-otp")
    sendVerifyOtp(
        @Body() emailDto: EmailDto,
    ) {
        return this.authService.sendVerifyOtp(emailDto);
    }
}