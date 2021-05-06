import { io } from "../http";
import { ConnectionsService } from '../services/ConnectionsService';
import { IConnectionCreate } from '../models/IConnectionCreate';
import { UsersService } from '../services/UsersService';
import { IUserCreate } from '../models/IUserCreate';
import { MessagesService } from '../services/MessagesService';
import { IMessageCreate } from '../models/IMessageCreate';
import { IParams } from '../models/IParams';

io.on("connect", (socket) => {
  const connectionsService: ConnectionsService = new ConnectionsService();
  const usersService: UsersService = new UsersService();
  const messagesService: MessagesService = new MessagesService();

  socket.on("client_first_access", async params => {
    const socket_id = socket.id;
    const {text, email} = params as IParams;
    let user_id = null;

    const userExists = await usersService.findByEmail(email);

    if (!userExists) {
      const iUserCreate: IUserCreate = {
        email: email
      }

      const user = await usersService.create(iUserCreate);

      user_id = user.id;

      const iConnectionCreate: IConnectionCreate = {
        socket_id: socket_id,
        user_id: user_id
      }
      await connectionsService.create(iConnectionCreate);
    } else {
      user_id = userExists.id;

      const connection = await connectionsService.findByUserId(userExists.id);
      const iConnectionCreate: IConnectionCreate = {
        user_id: user_id,
        socket_id: !connection ? socket_id : connection.socket_id
      };

      await connectionsService.create(iConnectionCreate);
    }

    const iMessageCreate: IMessageCreate = {
      text: text,
      user_id: user_id
    }

    await messagesService.create(iMessageCreate);
  });
});
