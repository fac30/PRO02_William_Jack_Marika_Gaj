import { Events } from "discord.js";
import handleMessage from "../messaging/message.js";

export default {
  name: Events.MessageCreate,

  async execute(message) {
    handleMessage(message);
  },
};
