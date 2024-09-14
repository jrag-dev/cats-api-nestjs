import { Breed } from "src/breeds/entities/breed.entity";
import { User } from "src/users/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";


@Entity({ name: 'cats'})
export class Cat {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column({ default: 'Black' })
  colour: string;

  @Column()
  breedId: number;

  @ManyToOne(() => Breed, (breed) => breed.id, {
    eager: true
  })
  breed: Breed

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userEmail', referencedColumnName: 'email'})
  user: User

  @Column()
  userEmail: string;

  @CreateDateColumn()
  createdDateAt: Date;

  @CreateDateColumn()
  updatedDateAt: Date;

  @BeforeInsert()
  createDates() {
    this.createdDateAt = new Date()
  }

  @BeforeUpdate()
  updateDates() {
    this.updatedDateAt = new Date()
  }
}
