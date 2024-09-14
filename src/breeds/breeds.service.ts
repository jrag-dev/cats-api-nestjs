import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Breed } from './entities/breed.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BreedsService {

  constructor(
    @InjectRepository(Breed)
    private readonly breedsRepository: Repository<Breed>
  ){}

  public async create(createBreedDto: CreateBreedDto) {
    const breed_db = await this.breedsRepository.findOne({
      where: {
        name: createBreedDto.name
      }
    })

    if (breed_db) {
      throw new BadRequestException('Breed already registered')
    }

    const breed = this.breedsRepository.create(createBreedDto);

    return await this.breedsRepository.save(breed);
  }

  public async findAll() {
    return await this.breedsRepository.find();
  }

  public async findOne(id: number) {

    const breed_db = await this.breedsRepository.findOne({
      where: {
        id
      }
    })

    if (!breed_db) {
      throw new NotFoundException('Breed not found')
    }

    return breed_db;
  }

  public async update(id: number, updateBreedDto: UpdateBreedDto) {
    const breed_db = await this.breedsRepository.findOne({
      where: {
        id
      }
    })

    if (!breed_db) {
      throw new NotFoundException('Breed not found')
    }

    const updatedBreed = Object.assign(breed_db, updateBreedDto);

    return await this.breedsRepository.save(updatedBreed);
  }

  public async remove(id: number) {

    const breed_db = await this.breedsRepository.findOne({
      where: {
        id
      }
    })

    if (!breed_db) {
      throw new NotFoundException('Breed not found')
    }

    return await this.breedsRepository.softDelete(id);
  }

  public async getBreedById(id: number) {
    return await this.breedsRepository.findOne({
      where: {
        id
      }
    })
  }
}
