import { getCustomRepository, Repository } from 'typeorm';
import { Connection } from '../entities/Connection';
import { ConnectionsRepository } from '../repositories/ConnectionsRepository';
import { IConnectionCreate } from '../models/IConnectionCreate';

class ConnectionsService {
  private connectionRepository: Repository<Connection>;

  constructor() {
    this.connectionRepository = getCustomRepository(ConnectionsRepository);
  }

  async create(iConnectionCreate: IConnectionCreate) {
    const connection = this.connectionRepository.create(iConnectionCreate);
    await this.connectionRepository.save(connection);
    return connection;
  }

  async listByUser(user_id: string) {
    const list = await this.connectionRepository.find({
      where: { user_id },
      relations: ["user"]
    })

    return list;
  }

  async findByUserId(user_id: string) {
    const connection = await this.connectionRepository.findOne({
      user_id
    });

    return connection;
  }

  async findAllWithoutAdmin() {
    const connections = await this.connectionRepository.find({
      where: { admin_id: null },
      relations: ["user"]
    });
    return connections;
  }

  async findBySocketId(socket_id: string) {
    const connection = await this.connectionRepository.findOne({
      socket_id
    });

    return connection;
  }

  async updateAdminID(user_id: string, admin_id: string) {
    await this.connectionRepository
      .createQueryBuilder()
      .update(Connection)
      .set({admin_id})
      .where("user_id = :user_id", {
        user_id
      }).execute()
  }
}

export { ConnectionsService }
