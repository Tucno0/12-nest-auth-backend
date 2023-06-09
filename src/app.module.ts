import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // importamos el modulo de configuracion

    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME,
    }), // nos conectamos a la base de datos de mongo

    AuthModule, // importamos el modulo de autenticacion
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

  // constructor() {
  //   console.log(process.env);
  // }
}
