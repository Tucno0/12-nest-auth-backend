import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto { // CreateAuthDto es el DTO de la clase User - DTO: Data Transfer Object
    
    @IsEmail() // IsEmail() es un decorador de class-validator que indica que el campo email debe ser un email
    email: string;
    
    @IsString() // IsString() es un decorador de class-validator que indica que el campo name debe ser un string
    name: string;

    @MinLength(6) // MinLength(6) es un decorador de class-validator que indica que el campo password debe tener un minimo de 6 caracteres
    password: string;

}
