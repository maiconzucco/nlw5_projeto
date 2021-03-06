import { getCustomRepository, Repository } from 'typeorm';
import { SettingsRepository } from '../repositories/SettingsRepository';
import { ISettingCreate } from '../models/ISettingCreate';
import { Setting } from '../entities/Setting';

class SettingsService {
  private settingsRepository: Repository<Setting>;

  constructor() {
    this.settingsRepository = getCustomRepository(SettingsRepository);
  }

  async create(iSettingsCreate: ISettingCreate) {
    const userAlreadyExists = await this.settingsRepository.findOne({
      username: iSettingsCreate.username
    });

    if (userAlreadyExists) {
      throw new Error("User already exists!");
    } else {
      const settings = this.settingsRepository.create(iSettingsCreate);
      await this.settingsRepository.save(settings);
      return settings;
    }
  }

  async findByUsername(username: string) {
    const settings = await this.settingsRepository.findOne({
      username
    });

    return settings;
  }

  async update(username: string, chat: boolean) {
    const settings = await this.settingsRepository.createQueryBuilder()
      .update(Setting)
      .set({chat})
      .where("username = :username", {
        username
      }).execute();

  }
}

export { SettingsService }
