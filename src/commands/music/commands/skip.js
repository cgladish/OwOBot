import logger from "winston";
import qs from "query-string";

import * as resources from "../resources";
import { queue } from "../queue";
import {
  getUrlFromVideo,
  createNowPlayingEmbed,
  createNothingIsPlayingEmbed
} from "../helpers";

export const skip = async (message, args) => {
  const { channel, member } = message;
  const { voiceChannel } = member;
  try {
    if (!queue.getCurrentVideo()) {
      return channel.send(createNothingIsPlayingEmbed());
    }

    queue.skip();
    const video = queue.getCurrentVideo();
    if (video) {
      await channel.send(createNowPlayingEmbed(video));
    }
  } catch (err) {
    logger.error(err.toString());
    await channel.send("❌Failed to skip video.");
  }
};
