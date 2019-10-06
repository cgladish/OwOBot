import Discord from "discord.js";
import logger from "winston";

import * as commands from "./commands";
import auth from "../auth.json";

const bot = new Discord.Client();
bot.login(auth["discord"]["token"]);

bot.once("ready", evt => {
  logger.info("Bot logged in!");
});

bot.on("message", message => {
  const splitMessage = message.content.split(" ");
  if (!splitMessage.length || splitMessage[0].toLowerCase() !== "owo") {
    return;
  }

  const command = splitMessage[1];
  const args = splitMessage.slice(2, splitMessage.length);

  switch (command) {
    case "r":
    case "reddit":
      return commands.reddit(message.channel, args);
    default:
      message.channel.send("I don't understand this command :(");
  }
});

export default bot;
