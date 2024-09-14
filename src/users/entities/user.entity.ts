import { Cat } from "src/cats/entities/cat.entity";
import { Role } from "src/common/enums/role.enum";
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'users' })
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false, select: false})
  password: string;

  @Column({ type: 'enum',default: Role.USER, enum: Role})
  role: string;

  @DeleteDateColumn()
  deletedAt: Date;
}
