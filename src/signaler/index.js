import { DEV, PREPROD } from "../variables/general.js";

const initializeSignaler = (io) => {
  // ENV
  // toggle debug
  const DEBUG = process.env.APP_STATE === DEV || PREPROD;

  // VARIABLES
  let channels = {};
  let rooms = {};

  io.on("connection", async (socket) => {
    // INITIALIZE AFTER CONNECTION ESTABLISHED
    (function () {
      DEBUG &&
        console.log(
          `SOCKET ${socket.id} - has been connected`
        );
      socket.emit("connection-success", (storeId) => {
        // join the store id "socket room" to ease the signaling of the store scope
        // this will mark the visitor count aswell
        // join the chatsocket room as a "store" with store id
        socket.join(storeId);
      });
    })();

    socket.on(
      "chat-send",
      async (
        storeId,
        { content, roomId, channelId },
        callback
      ) => {
        DEBUG &&
          console.log(
            `SOCKET ${socket.id} - is sending a chat message`
          );

        // emit chat to the peer in the store, every peer in the store will store the info in the filesystem api on the client side
        // need to await this one to make sore the chat really does emitted to the other peer
        await socket.to(storeId).emit("receive-chat", {
          content,
          roomId,
          channelId,
        });

        // callback to render the double checkmark on the client side that indicate the chat has been sent to all the peer in the room
        DEBUG &&
          console.log(
            `SOCKET ${socket.id} - chat has been sent to the other peer in the store with ID: ${storeId}`
          );
        callback();
      }
    );

    socket.on(
      "chat-delete",
      async (
        storeId,
        { content, roomId, channelId },
        callback
      ) => {
        DEBUG &&
          console.log(
            `SOCKET ${socket.id} - is sending a chat message`
          );

        await socket.to(storeId).emit("signal-delete", {
          content,
          roomId,
          channelId,
        });

        DEBUG &&
          console.log(
            `SOCKET ${socket.id} - chat has been sent to the other peer in the store with ID: ${storeId}`
          );
        callback();
      }
    );

    socket.on("disconnect", () => {
      DEBUG &&
        console.log(
          `SOCKET ${socket.id} - peer disconnected`
        );
    });
  });
};

export default initializeSignaler;
