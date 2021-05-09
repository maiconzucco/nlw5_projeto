import { io } from "../http";
import { ConnectionsService } from '../services/ConnectionsService';
import { MessagesService } from '../services/MessagesService';
import { IMessageCreate } from '../models/IMessageCreate';

io.on("connect", async (socket) => {
  const connectionsService: ConnectionsService = new ConnectionsService();
  const messagesService: MessagesService = new MessagesService();
  // const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();
  const allConnections = await connectionsService.findAll()

  io.emit("admin_connect", allConnections);

  socket.on("admin_list_messages_by_user", async (params, callback) => {
    const { user_id } = params;

    const allMessages = await messagesService.listByUser(user_id);

    callback(allMessages);
  });

  socket.on("admin_send_message", async (params, callback) => {
    const { user_id, text } = params;

    const iMessageCreate: IMessageCreate = {
      admin_id: socket.id,
      text: text,
      user_id: user_id
    }

    await messagesService.create(iMessageCreate);

    const connection = await connectionsService.findByUserId(user_id);
    const socket_id = connection.socket_id;

    io.to(socket_id).emit("admin_send_to_client", {
      text,
      socket_id: socket.id
    })
  });

  socket.on("admin_user_in_support", async params => {
    const { user_id } = params;
    const connection = await connectionsService.findByUserId(user_id);
    connectionsService.updateAdminID(user_id, socket.id);

    // const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();
    const allConnections = await connectionsService.findAll();
    io.emit("admin_list_all_users_without_admin", allConnections);
  })
});
