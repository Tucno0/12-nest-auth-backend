import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {

    _id?: string; // _id es el id de mongo que se genera automaticamente

    @Prop({ unique: true , required: true }) // unique: true, para que no se repita el email en la base de datos y required: true, para que sea obligatorio
    email: string;

    @Prop({ required: true })
    name: string;

    @Prop({ minlength: 6, required: true }) // minlength: 6, para que la contraseña tenga un minimo de 6 caracteres y required: true, para que sea obligatorio
    password?: string;

    @Prop({ default: true }) // default: true, para que por defecto el usuario este activo
    isActive: boolean;

    // ['user', 'admin']
    @Prop({ type: [String], default: ['user'] }) // type: [String], para que sea un array de strings y default: ['user'], para que por defecto el usuario tenga el rol de user
    roles: string[];

}

export const UserSchema = SchemaFactory.createForClass(User); // SchemaFactory.createForClass(User) es para crear el esquema de la clase User y poder usarlo en el modulo de auth.module.ts
