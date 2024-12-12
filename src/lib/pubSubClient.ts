import { PubSub } from "@google-cloud/pubsub";
import dotenv from "dotenv";

dotenv.config();

export const pubSubClient = new PubSub({
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  keyFilename: process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_PUBSUB_PATH,
});
