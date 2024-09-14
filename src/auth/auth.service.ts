import { BadRequestException, Get, Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ){}

  // TODO: Register an user
  public async register(registerUserDto: RegisterDto) {
    const { email, password } = registerUserDto;

    const user_db = await this.usersService.getOneUserByEmail(email)

    if (user_db) {
      throw new BadRequestException('This user already registered')
    }

    // hash del password
    const salt = await bcrypt.genSalt();
    const passwordHashed = await bcrypt.hash(password, salt)

    const newUser = { ...registerUserDto, password: passwordHashed}
    return await this.usersService.create(newUser);
  }

  // TODO: Login
  public async login({ email, password }: LoginDto) {
    const user_db = await this.usersService.findOneByEmailWithPassword(email)

    if (!user_db) {
      throw new UnauthorizedException('This user is not registered')
    }

    const passwordCorrect = await bcrypt.compare(password, user_db.password);

    if (!passwordCorrect) {
      throw new UnauthorizedException('Email/password not match')
    }

    // create a jsonwebtoken
    const payload = {
      email: user_db.email,
      role: user_db.role,
    }

    return {
      token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET')
      })
    }
  }

  async profile({ email, role}: { email: string, role: string}) {

    return await this.usersService.getOneUserByEmail(email);
  }
  
}
