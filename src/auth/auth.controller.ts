import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto, LoginDto, RegistereUserDto, UpdateAuthDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from './entities/user.entity';
import { LoginResponse } from './interfaces/login-response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post() es un decorador que indica que el metodo que le sigue es un metodo post
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // console.log(createUserDto);
    return this.authService.create(createUserDto);
  }

  @Post('/login')
  login( @Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('/register')
  register( @Body() registerDto: RegistereUserDto) {
    return this.authService.register(registerDto);
  }

  // @Get() es un decorador que indica que el metodo que le sigue es un metodo get
  @UseGuards( AuthGuard) // UseGuards( AuthGuard) es para usar el guard que creamos, nos permite proteger las rutas
  @Get()
  findAll( @Request() req: Request ) {
    const user = req['user']; // req['user'] es para obtener el usuario que esta en el request

    // return user;
    return this.authService.findAll();
  }

  @UseGuards( AuthGuard)
  @Get('/check-token')
  checkToken( @Request() req: Request ): LoginResponse {
    const user = req['user'] as User; // req['user'] es para obtener el usuario que esta en el request

    return {
      user: user,
      token: this.authService.getJwtToken({ id: user._id })
    }
  }

  // // @Get(':id') es un decorador que indica que el metodo que le sigue es un metodo get
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // // @Patch(':id') es un decorador que indica que el metodo que le sigue es un metodo patch
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // // @Delete(':id') es un decorador que indica que el metodo que le sigue es un metodo delete
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
