import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { Request } from 'express';
import { RequestWithUser } from './interfaces/auth.interfaces';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { Role } from '../common/enums/role.enum';
import { Auth } from './decorators/auth.decorator';
import { ActiveUserDecorator } from 'src/common/decorators/active-user.decorator';
import { ActiveUserInterface } from 'src/common/interfaces/active-user.interface';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ){}

  @Post('/register')
  register(@Body() registerUserDto: RegisterDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {

    return this.authService.login(loginDto);
  }

  /*
  @Get('profile')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  profile(@Req() req: RequestWithUser) {
    return this.authService.profile({
      email: req.user.email,
      role: req.user.role
    });
  }
  */


  @Get('profile')
  @Auth(Role.USER)
  profile(@ActiveUserDecorator() user: ActiveUserInterface) {
    console.log(user.role === Role.USER)
    return this.authService.profile({
      email: user.email,
      role: user.role
    });
  }

}
