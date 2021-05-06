import { Router } from 'express';
import { SettingsController } from './controllers/SettingsController';
import { UsersController } from './controllers/UsersController';
import { MessagesController } from './controllers/MessagesController';

const routes = Router();

const settingController = new SettingsController();
const usersController = new UsersController();
const messaagesController = new MessagesController();

routes.post("/settings", settingController.create);
routes.get("/settings/:username", settingController.findByUsername);
routes.put("/settings/:username", settingController.update);

routes.post("/users", usersController.create);

routes.post("/messages", messaagesController.create);
routes.get("/messages/:user_id", messaagesController.showByUser);

export { routes }
