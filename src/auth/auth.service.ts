import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';

import { CreateUserDto, UpdateAuthDto, RegistereUserDto, LoginDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload';

import { User } from './entities/user.entity';

import { LoginResponse } from './interfaces/login-response';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel( User.name ) private userModel: Model<User>, // InjectModel( User.name ) es para inyectar el modelo de la clase User y poder usarlo en el modulo de auth.module.ts
    private jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log(createUserDto);
    
    try {
      
      const { password, ...userData} = createUserDto; // password, ...userData es para separar el password del resto de datos del usuario
      
      // 1 - Encriptar la contraseña
      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10), // bcryptjs.hashSync(password, 10) es para encriptar la contraseña
        ...userData
      });

      // 2 - Guardar el usuario
      await newUser.save(); // save() es para guardar el usuario en la base de datos
      
      // 3 - Generar el JWT
      const { password:_, ...user } = newUser.toJSON(); // password:_, user es para separar el password del resto de datos del usuario

      return user;

    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${createUserDto.email} already exists`);
      }

      throw new InternalServerErrorException('Something terrible has happened');
    }
  }

  async register( registerDto: RegistereUserDto): Promise<LoginResponse> {
    
    const user = await this.create( registerDto );
    console.log({user});

    return {
      user: user,
      token: this.getJwtToken({ id: user._id }),
    }
  }

  async login( loginDto: LoginDto): Promise<LoginResponse> {
    console.log({ loginDto});

    const { email, password } = loginDto; // Se hace la destructuracion del loginDto para separar el email y el password

    const user = await this.userModel.findOne({ email: email }); // findOne({ email: email }) es para buscar un usuario por el email

    if ( !user ) { // Si no existe el usuario
      throw new UnauthorizedException('Invalid credentials - email');   
    }

    if ( !bcryptjs.compareSync(password, user.password) ) { // Si la contraseña no es correcta
      throw new UnauthorizedException('Invalid credentials - password');   
    }

    const { password:_, ...rest } = user.toJSON(); // password:_, ...payload es para separar el password del resto de datos del usuario
      
    return {
      user: rest,
      token: this.getJwtToken({ id: user.id }),
    }

    /**
     * User { _id. name, email, roles,}
     * Token -> ASSASDAD.DADADASAASAS.ADASADASA
     */
  }

  findAll(): Promise<User[]> {
    return this.userModel.find(); // find() es para buscar todos los usuarios
  }

  async findUserById( id: string ): Promise<User> {
    const user = await this.userModel.findById( id ); // findById( id ) es para buscar un usuario por el id
    const { password, ...rest } = user.toJSON(); // password:_, ...payload es para separar el password del resto de datos del usuario
    return rest; // Se retorna el usuario sin el password
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken( payload: JwtPayload ) {
    const token = this.jwtService.sign(payload); // signAsync(payload) es para generar el token
    return token;

  }
}
