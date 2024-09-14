import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ){}

  // TODO: Create a new user
  public async create(createUserDto: CreateUserDto) {
    const user_db = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email
      }
    })

    if (user_db) {
      throw new BadRequestException('This user already registered');
    }

    const newUser = this.usersRepository.create(createUserDto);

    return await this.usersRepository.save(newUser);
  }

  // TODO: Get all users
  findAll() {
    return this.usersRepository.find({});
  }

  // TODO: Get an user by Id
  public async findOne(id: number) {
    const user_db = await this.usersRepository.findOne({
      where: {
        id
      }
    })

    if (!user_db) {
      throw new NotFoundException('User not found')
    }

    return user_db;
  }

  // TODO: Get an user by his email
  public async getOneUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email: email
      }
    })
    return user;
  }

  // TODO: Update an user 
  public async update(id: number, updateUserDto: UpdateUserDto) {
    const user_db = await this.usersRepository.findOne({
      where: {
        id
      }
    })

    if (!user_db) {
      throw new NotFoundException('User not found')
    }

    const updateUser = Object.assign(user_db, updateUserDto);

    return this.usersRepository.save(updateUser);
  }

  // TODO: Soft delete an user
  public async remove(id: number) {
    const user_db = await this.usersRepository.findOne({
      where: {
        id
      }
    })

    if (!user_db) {
      throw new NotFoundException('User not found')
    }

    return this.usersRepository.softDelete(id);
  }

  public async findOneByEmailWithPassword(email: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email
      },
      select: ['id', 'email', 'password', 'role']
    })
    return user;
  }
}
