import { IsEmail } from "class-validator";



export class EmailDto {
    @IsEmail({}, {
        message: "Please enter a valid email",
    })
    email! : string;
}