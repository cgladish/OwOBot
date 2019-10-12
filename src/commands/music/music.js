import logger from "winston";

import { play } from "./play";

export const music = (message, args) => {
  const { channel, member } = message;
  const { voiceChannel } = member;
  try {
    if (!args.length) {
      return channel.send("You need to provide a subcommand!");
    }
    const subcommand = args[0];
    const remainingArgs = args.slice(1, args.length);
    switch (subcommand) {
      case "play":
        return play(message, remainingArgs);
      default:
        return channel.send("Invalid subcommand provided.");
    }
  } catch (err) {
    logger.error(err.toString());
    return channel.send("Failed to perform command.");
  }
};