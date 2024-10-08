import express from "express";
import InitWebsocket from "./src/config/websocket.js";
import defaultRoute from "./src/routes/default.js";
import AppConfig from "./src/config/index.js";
import initializeSignaler from "./src/signaler/index.js";
import { InitGRPC } from "./src/config/grpc.js";
import {
  APP_PORT,
  APP_WITH_PREFIX,
} from "./config/environment.js";

// Initialize express app object
const expressApp = express();

// Init App configurations
const { server, app } = AppConfig(expressApp, express);

// websocket initialization
const io = InitWebsocket(server);

// init proto
const protoClient = InitGRPC();

// Define Router
const routes = express.Router();

// Init Routes
defaultRoute(routes, protoClient);

// Assign all routes
if (APP_WITH_PREFIX) app.use("/he", routes);
else app.use("/", routes);

// Init Signaler
initializeSignaler(io, protoClient);

// Server listen
const port = APP_PORT || 7000;
server.listen(port, () => {
  console.log(
    `Signaling Server is up and running on ${port} ...`
  );
});
