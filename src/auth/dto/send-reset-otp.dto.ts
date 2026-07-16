import { IsEmail } from "class-validator";



export class SendResetOtpDto {
    @IsEmail({}, {
        message: "Please enter a valid email"
    })

    email! : string;
}