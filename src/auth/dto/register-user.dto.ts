import { IsEmail, IsString, MinLength } from "class-validator";

export class RegistereUserDto { // CreateAuthDto es el DTO de la clase User - DTO: Data Transfer Object
    
    @IsEmail()
    email: string;
    
    @IsString()
    name: string;

    @MinLength(6)
    password: string;

}
