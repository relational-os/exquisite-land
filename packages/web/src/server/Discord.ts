export type DiscordMessage = {
  id: string;
  content: string;
  author: { id: string; avatar: string; username: string };
  timestamp: Date;
};
export type DiscordMessages = DiscordMessage[];

export const getMessagesForChannelName = async (channelName: string) => {
  const channelID = TEXT_CHANNELS[channelName];
  if (!channelID) {
    throw new Error(`Unknown channel name: ${channelName}`);
  }
  const messages = await getMessagesForChannel(channelID);
  return messages;
};

export const getMessagesForChannel = async (channelID: string) => {
  console.log(`Fetching messages for channel ${channelID}`);
  console.log(process.env.DISCORD_CLIENT_TOKEN);
  const messages: DiscordMessages = await fetch(
    `https://discord.com/api/v8/channels/${channelID}/messages`,
    {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_CLIENT_TOKEN}`
      }
    }
  ).then((res) => res.json());
  messages.reverse();
  return messages;
};

export const TEXT_CHANNELS: { [key: string]: string } = {
  // Public Channels
  announcements: '895477350257549363',
  lobby: '888519468320456754',
  'link-wallet': '888503581211234346',
  'help-me': '895476066049720420',
  bugs: '899694916681228289',

  // Canvases
  'terra-masu': '888518144346427392'
};
