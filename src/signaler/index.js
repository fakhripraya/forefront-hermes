import { APP_STATE } from "../../config/environment.js";
import { DEV, PREPROD } from "../variables/general.js";

const initializeSignaler = (io, protoClient) => {
  // ENV
  // toggle debug
  const DEBUG = APP_STATE === DEV || PREPROD;

  // VARIABLES
  let stores = {};
  let globalPeers = {};

  io.on("connection", async (socket) => {
    // INITIALIZE AFTER CONNECTION ESTABLISHED
    (function () {
      DEBUG &&
        console.log(
          `SOCKET ${socket.id} - has been connected`
        );
      socket.emit(
        "connection-success",
        async ({ storeId, user }) => {
          // join the store id "socket room" to ease the signaling of the store scope
          // this will mark the visitor count aswell
          // join the chatsocket room as a "store" with store id
          const newUser = {
            storeId: storeId,
            socketId: socket.id,
            userId: user ? user.userId : socket.id,
            details: user,
          };
          const newPeer = {
            user: newUser,
            socket: socket,
            socketId: socket.id,
            storeId: storeId,
          };

          try {
            // filter the stores object to get rid of double connection
            const store = Object.entries(stores).some(
              ([key, val]) => key === storeId
            );

            store &&
              Object.entries(stores[storeId]).forEach(
                ([key, val]) => {
                  console.log(val);
                  console.log(key);
                  if (
                    val.userId === newUser.userId &&
                    val.socketId !== newUser.socketId
                  )
                    handleDisconnect(
                      globalPeers[val.socketId]
                    );
                }
              );

            stores = {
              ...stores,
              [storeId]: {
                ...stores[storeId],
                [newUser.socketId]: newUser,
              },
            };
            globalPeers = {
              ...globalPeers,
              [newPeer.socketId]: newPeer,
            };

            await socket.join(storeId);
            socket.emit("new-connection-render", {
              allJoinedUsers: stores[storeId],
              user: newUser,
            });
            socket
              .to(storeId)
              .emit("new-connection-render", {
                allJoinedUsers: stores[storeId],
              });
          } catch (e) {
            DEBUG &&
              console.log(
                `SOCKET ${socket.id} - got error when joining the room: ${e}, disconnecting...`
              );
            await handleDisconnect(
              globalPeers[newUser.socketId]
            );
          }
        }
      );
    })();

    async function handleDisconnect(peer) {
      if (!peer) return;
      await peer.socket.disconnect();
    }

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
      try {
        const removingPeer = globalPeers[socket.id];
        delete stores[removingPeer.storeId][
          removingPeer.socketId
        ];
        delete globalPeers[removingPeer.socketId];

        socket
          .to(removingPeer.storeId)
          .emit("new-connection-render", {
            allJoinedUsers: stores[removingPeer.storeId],
          });
      } catch (e) {
        DEBUG &&
          console.log(
            `SOCKET ${socket.id} - error while cleaning the disconnected peer, error: ${e}`
          );
      }
    });
  });
};

export default initializeSignaler;
