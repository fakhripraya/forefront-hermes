import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";
import {
  APP_GRPC_MESSAGING_SERVICE_HOST,
  APP_GRPC_MESSAGING_SERVICE_PORT,
} from "../../config/environment.js";

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const InitGRPC = () => {
  // load proto
  const messagingPackageDefinition = protoLoader.loadSync(
    path.resolve(__dirname, "../../proto/messaging.proto"),
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    }
  );
  const MessagingProtoDescriptor =
    grpc.loadPackageDefinition(messagingPackageDefinition);
  const client =
    new MessagingProtoDescriptor.MessagingService(
      `${APP_GRPC_MESSAGING_SERVICE_HOST}:${APP_GRPC_MESSAGING_SERVICE_PORT}`,
      grpc.credentials.createInsecure()
    );

  return client;
};
