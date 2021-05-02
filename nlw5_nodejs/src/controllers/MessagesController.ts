import { Request, Response } from 'express';
import { MessagesService } from '../services/MessagesService';
import { IMessageCreate } from '../models/IMessageCreate';

class MessagesController {
  async create(request: Request, response: Response): Promise<Response> {
    const {admin_id, text, user_id} = request.body;

    const messagesService = new MessagesService();
    const iMessageCreate: IMessageCreate = {
      admin_id: admin_id,
      text: text,
      user_id: user_id
    }

    try {
      const messages = await messagesService.create(iMessageCreate);
      return response.json(messages);
    } catch (err) {
      return response.status(400).json( {
        message: err.message
      });
    }
  }

  async showByUser(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.params;

    const messagesService: MessagesService = new MessagesService();

    const list = await messagesService.listByUser(user_id);

    return response.json(list);
  }
}

export { MessagesController }
