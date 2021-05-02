import { Request, Response } from 'express';
import { SettingsService } from '../services/SettingsService';
import { ISettingCreate } from '../models/ISettingCreate';

class SettingsController {
  async create(request: Request, response: Response): Promise<Response> {
    const {chat, username} = request.body;

    const settingsService: SettingsService = new SettingsService();
    const iSettingsCreate: ISettingCreate = {
      chat: chat,
      username: username
    }

    try {
      const settings = await settingsService.create(iSettingsCreate);
      return response.json(settings);
    } catch (err) {
      return response.status(400).json({
        message: err.message
      });
    }
  }
}

export { SettingsController }
