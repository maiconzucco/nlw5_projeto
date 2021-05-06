import { IUserCreate } from '../models/IUserCreate';
import { getCustomRepository, Repository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import { User } from '../entities/User';

class UsersService {
  private usersRepository: Repository<User>;

  constructor() {
    this.usersRepository = getCustomRepository(UsersRepository);
  }

  async create(iUsersCreate: IUserCreate) {
    const userAlreadyExists = await this.usersRepository.findOne({
      email: iUsersCreate.email
    });

    if (userAlreadyExists) {
      return userAlreadyExists;
    } else {
      const user = this.usersRepository.create(iUsersCreate);
      await this.usersRepository.save(user);
      return user;
    }
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      email
    })

    return user;
  }
}

export { UsersService }
