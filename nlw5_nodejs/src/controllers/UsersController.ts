import { Request, Response } from 'express';
import { UsersService } from '../services/UsersService';
import { IUserCreate } from '../models/IUserCreate';

class UsersController {
  async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const usersService: UsersService = new UsersService();
    const iUsersCreate: IUserCreate = {
      email: email
    }

    try {
      const users = await usersService.create(iUsersCreate);
      return response.json(users);
    } catch (err) {
      return response.status(400).json({
        message: err.message
      })
    }
  }
}

export { UsersController }
