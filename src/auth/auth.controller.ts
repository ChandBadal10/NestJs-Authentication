import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import type { Response } from "express";
import { EmailDto } from "./dto/email.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { SendResetOtpDto } from "./dto/send-reset-otp.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { RolesGuard } from "./guards/roles.guard";
import { Role } from "./enums/role.enum";
import { Roles } from "./decorators/roles.decorator";




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


    @Post("verify-email")
    verifyEmail(
        @Body() verifyEmailDto: VerifyEmailDto,
    ) {
        return this.authService.verifyEmail(verifyEmailDto)
    }


    @Post("send-reset-otp")
    sendResetOtp(
        @Body() sendResetOtpDto: SendResetOtpDto,
    ) {
        return this.authService.sendResetOtp(sendResetOtpDto)
    }


    @Post("reset-password")
    resetPassword(
        @Body() resetPasswordDto: ResetPasswordDto,
    ) {
        return this.authService.resetPassword(resetPasswordDto);
    }


    @Get("admin")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    adminOnly() {
        return {
            success: true,
            message: "Welcome Admin!"
        }
    }
}