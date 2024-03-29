import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Task } from 'src/tasks/task.entity';

@Entity()
@Unique(['username']) // this grants that not duplicated usernames will be created
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany(() => Task, (tasks) => tasks.user, { eager: true })
  tasks: Task[];
  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);

    return hash === this.password;
  }
}
