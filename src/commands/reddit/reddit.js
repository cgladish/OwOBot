import Discord from "discord.js";
import snoowrap from "snoowrap";
import logger from "winston";

import auth from "auth.json";
import bot from "src/bot";
import { getImageUrlFromPost } from "./reddit.helpers";

const COUNT = 25;

const snooWrap = new snoowrap(auth["reddit"]);

export const reddit = (() => {
  const indicesBySubreddit = {};
  const postsBySubreddit = {};

  return async (channel, args) => {
    try {
      if (!args.length) {
        return channel.send("You need to provide a subreddit to fetch from!");
      }

      const subreddit = args[0];
      while (true) {
        if (!indicesBySubreddit[subreddit]) {
          indicesBySubreddit[subreddit] = 0;
        }
        const index = indicesBySubreddit[subreddit];
        ++indicesBySubreddit[subreddit];

        const indexWithinPage = index % COUNT;
        if (indexWithinPage === 0) {
          postsBySubreddit[subreddit] = await snooWrap
            .getSubreddit(subreddit)
            .getTop({ time: "all", count: COUNT, after: index });
          if (!postsBySubreddit[subreddit].length) {
            throw new Error("No posts left in the subreddit");
          }
        }

        const post = postsBySubreddit[subreddit][indexWithinPage];
        const imageUrl = getImageUrlFromPost(post);
        if (imageUrl) {
          const embed = new Discord.RichEmbed()
            .setColor("#0099ff")
            .setTitle(`Top post from ${post.subreddit.display_name}`)
            .setURL(`http://reddit.com${post.permalink}`)
            .setImage(getImageUrlFromPost(post))
            .setTimestamp();

          await channel.send(embed);
          break;
        }
      }
    } catch (err) {
      logger.error(err.toString());
      channel.send("Failed to retrieve post from the subreddit.");
    }
  };
})();
