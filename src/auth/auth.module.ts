import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule, 
    ConfigModule, 
    JwtModule.register(
      {
        global: true,
        signOptions: {
          expiresIn: '5h'
        },
      }
    )
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
