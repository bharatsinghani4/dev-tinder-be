const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const getSecretRoomId = (loggedInUserId, targetUserId) =>
  crypto
    .createHash("sha256")
    .update([loggedInUserId, targetUserId].sort().join("_"))
    .digest("hex");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ loggedInUserId, targetUserId }) => {
      const roomId = getSecretRoomId(loggedInUserId, targetUserId);

      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, loggedInUserId, targetUserId, text }) => {
        try {
          const ifFriends = await ConnectionRequest.findOne({
            $or: [
              {
                fromUserId: loggedInUserId,
                toUserId: targetUserId,
                status: "accepted",
              },
              {
                fromUserId: targetUserId,
                toUserId: loggedInUserId,
                status: "accepted",
              },
            ],
          });

          if (ifFriends) {
            const roomId = getSecretRoomId(loggedInUserId, targetUserId);
            let chat = await Chat.findOne({
              participants: { $all: [loggedInUserId, targetUserId] },
            });

            if (!chat) {
              chat = new Chat({
                participants: [loggedInUserId, targetUserId],
                messages: [],
              });
            }

            chat.messages.push({
              senderId: loggedInUserId,
              text,
            });

            await chat.save();
            io.to(roomId).emit("messageRecieved", { firstName, text });
          }
        } catch (error) {
          console.error(error);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
