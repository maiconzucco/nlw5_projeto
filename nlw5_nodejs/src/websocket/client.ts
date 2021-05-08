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
    } else {
      user_id = userExists.id;
    }

    const connection = await connectionsService.findByUserId(user_id);

    if (!connection) {
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

    const allMessages = await messagesService.listByUser(user_id);

    socket.emit("client_list_all_messages", allMessages);

    const allUsers = await connectionsService.findAllWithoutAdmin();
    io.emit("admin_list_all_users", allUsers);
  });

  socket.on("client_send_to_admin", async params => {
    const { text , socket_admin_id } = params;
    const socket_id = socket.id;
    const { user_id } = await connectionsService.findBySocketId(socket_id);
    const iMessageCreate: IMessageCreate = {
      text: text,
      user_id: user_id
    }

    const message = await messagesService.create(iMessageCreate);

    io.to(socket_admin_id).emit("admin_receive_message", {
      message,
      socket_id
    })
  })
});
