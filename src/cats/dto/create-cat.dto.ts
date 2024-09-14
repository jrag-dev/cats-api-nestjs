import { IsInt, IsOptional, IsPositive, IsString, Max, Min, MinLength } from "class-validator";


export class CreateCatDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsInt()
  @Min(0)
  @Max(15)
  @IsPositive()
  age: number;

  @IsString()
  @IsOptional()
  colour?: string;

  @IsInt()
  breedId: number;
}