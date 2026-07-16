import { IsEmail, IsNotEmpty, Length } from "class-validator";



export class VerifyEmailDto {
    @IsEmail({}, {
        message: "Please enter a valid email",
    })

    email! : string;


    @IsNotEmpty({
        message: "OTP is required",
    })

    @Length(6, 6, {
        message: "OTP must be 6 digits",
    })

    otp! : string;

}