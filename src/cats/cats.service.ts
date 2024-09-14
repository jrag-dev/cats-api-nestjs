import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Repository } from 'typeorm';
import { Cat } from './entities/cat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BreedsService } from 'src/breeds/breeds.service';
import { Breed } from 'src/breeds/entities/breed.entity';
import { ActiveUserInterface } from '../common/interfaces/active-user.interface';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class CatsService {

  constructor(
    @InjectRepository(Cat)
    private readonly catsRepository: Repository<Cat>,
    private readonly breedsService: BreedsService
  ) {}

  // TODO: Create a cat
  public async create(user: ActiveUserInterface, createCatDto: CreateCatDto) {

    await this.verifyBreed(createCatDto.breedId);

    const newCat = this.catsRepository.create(
      {
        ...createCatDto,
        userEmail: user.email
      }
    );
    return await this.catsRepository.save(newCat);
  }

  // TODO: Get all cats
  public async findAll(user: ActiveUserInterface) {
    if (user.role === Role.ADMIN) {
      return await this.catsRepository.find({});
    }
    return await this.catsRepository.find({
      where: {
        userEmail: user.email
      }
    });
  }

  // TOOD: Get cat by id
  public async findOne(id: number, user: ActiveUserInterface) {

    const catDb = await this.catsRepository.findOne({
      where: {
        id
      }
    })

    if (!catDb) {
      throw new NotFoundException('Cat not found');
    }

    this.validateOwnrship(catDb, user);

    return catDb;
  }

  // TODO: Update cat by his id
  public async update(id: number, updateCatDto: UpdateCatDto, user: ActiveUserInterface) {

    const catDb = await this.catsRepository.findOne({
      where: {
        id
      }
    })

    if (!catDb) {
      throw new NotFoundException('Cat not found');
    }

    if (catDb.userEmail !== user.email) {
      throw new UnauthorizedException();
    }

    let breed: Breed;
    if (updateCatDto.breedId) {
      breed = await this.breedsService.getBreedById(updateCatDto.breedId);

      if (!breed) {
        throw new BadRequestException('Breed not found')
      }
    }

    const updatedCat = Object.assign(catDb, updateCatDto, { breed });

    return this.catsRepository.save(updatedCat);
  }

  // TODO: Soft Delete cat by his id
  public async remove(id: number, user: ActiveUserInterface) {
    const catDb = await this.catsRepository.findOne({
      where: {
        id
      }
    })

    if (!catDb) {
      throw new NotFoundException('Cat not found');
    }

    if (catDb.userEmail !== user.email) {
      throw new UnauthorizedException();
    }

    return this.catsRepository.softDelete(id);
  }

  private validateOwnrship(cat: Cat, user: ActiveUserInterface) {
    if (user.role !== Role.ADMIN && cat.userEmail !== user.email) {
      throw new UnauthorizedException();
    }
  }

  // verificar si el breed existe
  private async verifyBreed(id: number) {
    const breed = await this.breedsService.getBreedById(id);

    if (!breed) {
      throw new BadRequestException('This breed not exist.')
    }

    return breed;
  }

}
