const NamespaceModel = require("./../models/Chat");
const UserModel = require("./../models/User");

exports.initConnection = (io) => {
  io.on("connection", async (socket) => {
    const users = await UserModel.find({}).sort({ _id: -1 });
    socket.emit("privateChats", users);
  });
};

exports.sendPvs = (io) => {
  io.of("/pvs").on("connection", (pvSocket) => {
    getNewMessage(io, pvSocket);
    removeMsg(io, pvSocket);

    pvSocket.on("joining", (data) => {
      const { sender, receiver } = data;
      const prevChat = Array.from(pvSocket.rooms);

      pvSocket.leave(prevChat[1]);
      pvSocket.leave(prevChat[2]);

      pvSocket.join(`${sender}-${receiver}`);
      pvSocket.join(`${receiver}-${sender}`);

      pvSocket.emit("pvInfo", data);
    });
  });
};

const getNewMessage = async (io, pvSocket) => {
  pvSocket.on("newMsg", async (data) => {
    const { pv } = data;
    const msgID = Math.floor(Math.random() * 99999);

    io.of("/pvs")
      .in(`${pv.sender}-${pv.receiver}`)
      .in(`${pv.receiver}-${pv.sender}`)
      .emit("confirmMsg", { ...data, msgID });
  });
};

const removeMsg = (io, pvSocket) => {
  pvSocket.on("removeMsg", (data) => {
    const rooms = Array.from(pvSocket.rooms);

    io.of("/pvs").in(rooms[1]).in(rooms[2]).emit("confirmRemoveMsg", data);
  });
};
