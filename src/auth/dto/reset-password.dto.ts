import { IsEmail, IsNotEmpty, Length, MinLength } from "class-validator";



export class ResetPasswordDto {
    @IsEmail({}, {
        message: "Please enter a valid email"
    })

    email! : string;

    @IsNotEmpty({
        message: "OTP is required"
    })

    @Length(6,6, {
        message: "OTP must be exactly 6 digits"
    })

    otp! : string;

    @MinLength(6, {
        message: "Password must be at least 6 characters",
    })

    newPassword! : string;
}