import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { MailService } from 'src/mail/mail.service';
import { EmailDto } from './dto/email.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,

        private readonly jwtService: JwtService,

        private readonly mailService: MailService,
    ) {}

    // Register the user
    async register(registerDto: RegisterDto) {
        try{
            const {name, email, password} = registerDto;

            //check if the user already exists
            const existingUser = await this.userModel.findOne({email});

            if(existingUser) {
                return {
                    success: false,
                    message: "User already exists",
                }
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            //create user
            const user = new this.userModel({
                name,
                email,
                password: hashedPassword
            })

            // save user

            await user.save();

            //return response
            return {
                success: true,
                message: "User registered successfully",
            };

        } catch(error: any) {
            return {
                success: false,
                message: "Internal server Error",
                error: error.message,
            }
        }
    }



    // Login
    async login(loginDto: LoginDto, response : Response) {
        try{

        const {email, password} = loginDto;

        const user = await this.userModel.findOne({email});

        if(!user) {
            return {
                success: false,
                message: "Invalid Email"
            }
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return {
                success: false,
                message: "Invalid password"
            }
        }

        const token = await this.jwtService.signAsync({
            id: user._id,
            email: user.email
        });

        response.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })


        return {
            success: true,
            message: "Login Successfully"
        }




    }
 catch(error: any) {
    return {
        success: false,
        message: "Internal Server Error",
        error: error.message
    }
 }
}


        // Logout
        async logout(response: Response) {
            response.clearCookie("token");

            return {
                success: true,
                message: "Logout Successfully",
            }
        }




        // generate verification otp

        async sendVerifyOtp(emailDto: EmailDto) {
            try {
                const { email } = emailDto;

                const user = await this.userModel.findOne({email});

                if(!user) {
                    return {
                        success: false,
                        message: "User not found",
                    }
                }

                if(user.isAccountVerified) {
                    return {
                        success: false,
                        message: "Account already verified",
                    }
                }

                const otp = Math.floor(100000 + Math.random() * 900000).toString();

                user.verifyOtp = otp;

                user.verifyOtpExpiredAt = Date.now() + 10 * 60 * 1000;

                await user.save();

                await this.mailService.sendEmail(
                email,
                "Verify Your Email",
                `
                <h2>Email Verification</h2>

                <p>Hello ${user.name},</p>

                <p>Your verification OTP is:</p>

                <h1>${otp}</h1>

                <p>This OTP is valid for 10 minutes.</p>

                <p>Thank you.</p>
                `,
                );

                return {
                success: true,
                message: "Verification OTP sent successfully",
                };

            } catch(error: any) {
                return {
                    success: false,
                    message : "Internal Server Error",
                    error: error.message
                }
            }
        }




            // Check verify email

            async verifyEmail(verifyEmailDto: VerifyEmailDto) {
                try{
                    const { email, otp } = verifyEmailDto;

                    //find user by email
                    const user = await this.userModel.findOne({email});

                    if(!user) {
                        return {
                            success: false,
                            message: "User not found"
                        }
                    }

                    // check whether the account is already verified or nto

                    if(user.isAccountVerified) {
                        return {
                            success: false,
                            message: "Account already verified",
                        }
                    }

                    //Compare the otp
                    if(user.verifyOtp !== otp) {
                        return {
                            success: false,
                            message: "Invalid OTP"
                        }
                    }

                    //check otp expiry

                    if(user.verifyOtpExpiredAt < Date.now()) {
                        return {
                            success: false,
                            message: "OTP has expired"
                        }
                    }

                    user.isAccountVerified = true;

                    //clear otp after successful verification

                    user.verifyOtp = "";
                    user.verifyOtpExpiredAt = 0;

                    user.save();

                    return {
                        success: true,
                        message: "Email verified successfully",
                    }

                } catch(error: any) {
                    return{
                        success: false,
                        message: "Internal Server Error",
                        error: error.message
                    }
                }
            }


}