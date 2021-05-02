import { IMessageCreate } from '../models/IMessageCreate';
import { getCustomRepository, Repository } from 'typeorm';
import { MessagesRepository } from '../repositories/MessagesRepository';
import { Message } from '../entities/Message';

class MessagesService {
  private messagesRepository: Repository<Message>;

  constructor() {
    this.messagesRepository = getCustomRepository(MessagesRepository);
  }

  async create(iMessagesCreate: IMessageCreate) {
    const message = this.messagesRepository.create(iMessagesCreate);
    await this.messagesRepository.save(message);
    return message;
  }

  async listByUser(user_id: string) {
    const list = await this.messagesRepository.find({
      where: { user_id },
      relations: ["user"]
    })

    return list;
  }
}

export { MessagesService }
