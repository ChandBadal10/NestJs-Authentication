
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterDto {
    @IsNotEmpty({
        message: "Name is required",
    })

    name! : string;

    @IsEmail({}, {
        message: "Please enter a valid email"
    })

    email! : string;

    @MinLength(6, {
        message: "Password must be at least 6 characters",
    })
    password! : string;
}