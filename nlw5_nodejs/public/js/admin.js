const socket = io();
let connectionsUsers = [];

socket.on("admin_connect", (connections) => {
  connectionsUsers  = connections;
  const connectionUsersWhithoutAdmin = connections.filter(connection => connection.admin_id === null);
  const connectionUserWithAdmin = connections.filter(connection => connection.admin_id !== null);

  socket.emit("admin_list_all_users_without_admin", connectionUsersWhithoutAdmin);

  connectionUserWithAdmin.forEach((connection) => call(connection.socket_id));
})

socket.on("admin_list_all_users_without_admin", (connections) => {
  connectionsUsers  = connections;

  let template = document.getElementById("template").innerHTML;

  document.getElementById("list_users").innerHTML = '';

  connections.filter(con => con.admin_id === null).forEach((connection) => {
    const rendered = Mustache.render(template, {
      email: connection.user.email,
      id: connection.socket_id,
    });

    document.getElementById("list_users").innerHTML += rendered;
  });
});

function call(id) {
  const connection = connectionsUsers.find((connection) => connection.socket_id === id);

  const template = document.getElementById("admin_template").innerHTML;

  const rendered = Mustache.render(template, {
    email: connection.user.email,
    id: connection.user_id,
  });

  document.getElementById("supports").innerHTML += rendered;

  const params = {
    user_id: connection.user_id,
  };

  socket.emit("admin_user_in_support", params);

  socket.emit("admin_list_messages_by_user", params, (messages) => {
    const divMessages = document.getElementById(`allMessages${connection.user_id}`);

    messages.forEach((message) => {
      const createDiv = document.createElement("div");

      if (message.admin_id === null) {
        createDiv.className = "admin_message_client";

        createDiv.innerHTML = `<span>${connection.user.email}</span>`;
        createDiv.innerHTML += `<span>${message.text}</span>`;
        createDiv.innerHTML += `<span class="admin_date">${dayjs(
          message.created_at
        ).format("DD/MM/YYYY HH:mm:ss")}</span>`;
      } else {
        createDiv.className = "admin_message_admin";

        createDiv.innerHTML = `Atendente: <span>${message.text}</span>`;
        createDiv.innerHTML += `<span class="admin_date>${dayjs(
          message.created_at
        ).format("DD/MM/YYYY HH:mm:ss")}`;
      }

      divMessages.appendChild(createDiv);
    });
  });
}

function sendMessage(id) {
  const text = document.getElementById(`send_message_${id}`);

  const params = {
    user_id: id,
    text: text.value
  };

  socket.emit("admin_send_message", params);

  const divMessages = document.getElementById(`allMessages${id}`);

  const createDiv = document.createElement("div");
  createDiv.className = "admin_message_admin";
  createDiv.innerHTML = `Atendente: <span>${params.text}</span>`;
  createDiv.innerHTML += `<span class="admin_date>${dayjs().format(
    "DD/MM/YYYY HH:mm:ss"
  )}`;

  divMessages.appendChild(createDiv);

  text.value = "";
}

socket.on("admin_receive_message", (data) => {
  // console.log(data);
  const connection = connectionsUsers.find(
    (connection) => (connection.socket_id = data.socket_id)
  );

  const divMessages = document.getElementById(
    `allMessages${data.message.user_id}`
  );

  const createDiv = document.createElement("div");

  createDiv.className = "admin_message_client";
  createDiv.innerHTML = `<span>${connection.user.email} </span>`;
  createDiv.innerHTML += `<span>${data.message.text}</span>`;
  createDiv.innerHTML += `<span class="admin_date">${dayjs(
    data.message.created_at
  ).format("DD/MM/YYYY HH:mm:ss")}</span>`;

  divMessages.appendChild(createDiv);
});
