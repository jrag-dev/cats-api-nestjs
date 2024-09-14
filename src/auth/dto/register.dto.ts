import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
   
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @Transform( ({value}) => value.trim())
  @IsEmail()
  email: string;

  @Transform( ({value}) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;
}