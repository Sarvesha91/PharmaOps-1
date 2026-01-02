import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from './User';

@Entity({ name: 'companies' })
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  domain?: string;

  @OneToMany(() => User, (u) => u.company)
  users?: User[];
}
