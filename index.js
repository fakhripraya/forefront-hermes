import express from "express";
import InitWebsocket from "./src/config/websocket.js";
import dotenv from "dotenv";
import defaultRoute from "./src/routes/default.js";
import AppConfig from "./src/config/index.js";
import initializeSignaler from "./src/signaler/index.js";
import { InitGRPC } from "./src/config/grpc.js";

// Init env
dotenv.config();

// Initialize express app object
const expressApp = express();

// Init App configurations
const { server, app } = AppConfig(expressApp, express);

// websocket initialization
const io = InitWebsocket(server);

// init proto
const protoClient = InitGRPC();

// Init Routes
defaultRoute(app, protoClient);

// Init Signaler
initializeSignaler(io, protoClient);

// Server listen
const port = process.env.PORT || 7001;
server.listen(port, () => {
  console.log(
    `Signaling Server is up and running on ${port} ...`
  );
});
